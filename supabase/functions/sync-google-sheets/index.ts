
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

    // Fetch data from Google Sheets (evaluation tab)
    const evaluationData = await fetchSheetData(spreadsheetId, config.evaluation_tab)
    const approvedData = await fetchSheetData(spreadsheetId, config.approved_tab)
    const rejectedData = await fetchSheetData(spreadsheetId, config.rejected_tab)

    // Process and insert data
    const contentItems = [
      ...processSheetData(evaluationData, 'pending'),
      ...processSheetData(approvedData, 'approved'),
      ...processSheetData(rejectedData, 'rejected')
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
        itemsProcessed: contentItems.length 
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

function processSheetData(data: any[], status: string): any[] {
  if (!data || data.length < 2) return []

  const headers = data[0]
  const rows = data.slice(1)

  return rows.map((row: any[]) => {
    const item: any = {
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Map common columns (adjust based on your sheet structure)
    item.title = row[0] || 'Sem título'
    item.content = row[1] || 'Sem conteúdo'
    item.category = row[2] || 'Geral'
    item.image_url = row[3] || null
    item.type = row[4] || (item.image_url ? 'image' : 'text')

    return item
  }).filter(item => item.title && item.content)
}
