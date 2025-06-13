
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get spreadsheet configuration
    const { data: config, error: configError } = await supabaseClient
      .from('spreadsheet_config')
      .select('*')
      .single()

    if (configError || !config?.spreadsheet_url) {
      return new Response(
        JSON.stringify({ error: 'Configuração da planilha não encontrada' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get column configurations
    const { data: columns, error: columnsError } = await supabaseClient
      .from('spreadsheet_columns')
      .select('*')
      .eq('config_id', config.id)
      .order('display_order')

    if (columnsError) {
      console.error('Erro ao carregar configurações de colunas:', columnsError)
      return new Response(
        JSON.stringify({ error: 'Erro ao carregar configurações de colunas' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extract spreadsheet ID from URL
    const spreadsheetId = extractSpreadsheetId(config.spreadsheet_url)
    if (!spreadsheetId) {
      return new Response(
        JSON.stringify({ error: 'URL da planilha inválida' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Clear existing content
    await supabaseClient.from('content_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Fetch data from Google Sheets (evaluation tab only for now)
    const evaluationData = await fetchSheetData(spreadsheetId, config.evaluation_tab)
    const approvedData = await fetchSheetData(spreadsheetId, config.approved_tab)
    const rejectedData = await fetchSheetData(spreadsheetId, config.rejected_tab)

    // Process and insert data using column configurations
    const contentItems = [
      ...processSheetDataWithColumns(evaluationData, columns || [], 'pending'),
      ...processSheetDataWithColumns(approvedData, columns || [], 'approved'),
      ...processSheetDataWithColumns(rejectedData, columns || [], 'rejected')
    ]

    if (contentItems.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('content_items')
        .insert(contentItems)

      if (insertError) {
        console.error('Erro ao inserir dados:', insertError)
        return new Response(
          JSON.stringify({ error: 'Erro ao salvar dados no banco' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Sincronização concluída com sucesso',
        itemsProcessed: contentItems.length,
        columnsUsed: columns?.length || 0
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erro na sincronização:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}

async function fetchSheetData(spreadsheetId: string, tabName: string): Promise<any[]> {
  const apiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY')
  if (!apiKey) {
    console.warn('Google Sheets API key não configurada')
    return []
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tabName)}?key=${apiKey}`
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`Erro ao buscar dados da aba ${tabName}:`, response.status)
      return []
    }

    const data = await response.json()
    return data.values || []
  } catch (error) {
    console.error(`Erro ao buscar dados da aba ${tabName}:`, error)
    return []
  }
}

function columnLetterToIndex(letter: string): number {
  let index = 0
  for (let i = 0; i < letter.length; i++) {
    index = index * 26 + (letter.charCodeAt(i) - 'A'.charCodeAt(0) + 1)
  }
  return index - 1 // Convert to 0-based index
}

function processSheetDataWithColumns(data: any[], columns: any[], status: string): any[] {
  if (!data || data.length < 2 || !columns || columns.length === 0) return []

  const rows = data.slice(1) // Skip header row

  return rows.map((row: any[]) => {
    const item: any = {
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: 'Geral', // Default category
    }

    // Map columns based on configuration
    columns.forEach(column => {
      const columnIndex = columnLetterToIndex(column.column_letter)
      const cellValue = row[columnIndex] || ''

      switch (column.field_type) {
        case 'title':
          item.title = cellValue || 'Sem título'
          break
        case 'content':
          item.content = cellValue || 'Sem conteúdo'
          break
        case 'image_url':
          item.image_url = cellValue || null
          break
        case 'category':
          item.category = cellValue || 'Geral'
          break
        case 'custom':
          // For custom fields, we could store them in a JSON field or handle differently
          // For now, we'll ignore custom fields as they don't map to existing columns
          break
      }
    })

    // Ensure required fields have values
    if (!item.title) item.title = 'Sem título'
    if (!item.content) item.content = 'Sem conteúdo'
    
    // Determine content type
    item.type = item.image_url ? (item.content ? 'mixed' : 'image') : 'text'

    return item
  }).filter(item => item.title && item.content) // Only return items with essential data
}
