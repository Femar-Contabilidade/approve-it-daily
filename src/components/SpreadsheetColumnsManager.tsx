import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { SpreadsheetColumn } from "@/hooks/useSpreadsheetConfig";

interface SpreadsheetColumnsManagerProps {
  columns: SpreadsheetColumn[];
  onColumnsChange: (columns: SpreadsheetColumn[]) => void;
}

export const SpreadsheetColumnsManager = ({ columns, onColumnsChange }: SpreadsheetColumnsManagerProps) => {
  const [editingColumn, setEditingColumn] = useState<SpreadsheetColumn | null>(null);
  const [newColumn, setNewColumn] = useState({
    columnLetter: "",
    columnName: "",
    fieldType: "custom" as SpreadsheetColumn['fieldType'],
    isRequired: false,
  });

  const fieldTypeOptions = [
    { value: 'title', label: 'Título' },
    { value: 'content', label: 'Conteúdo/Texto' },
    { value: 'image_url', label: 'URL da Imagem' },
    { value: 'category', label: 'Categoria' },
    { value: 'custom', label: 'Campo Personalizado' },
  ];

  const handleAddColumn = () => {
    if (!newColumn.columnLetter || !newColumn.columnName) {
      return;
    }

    const column: SpreadsheetColumn = {
      id: Date.now().toString(),
      columnLetter: newColumn.columnLetter.toUpperCase(),
      columnName: newColumn.columnName,
      fieldType: newColumn.fieldType,
      isRequired: newColumn.isRequired,
      displayOrder: columns.length + 1,
    };

    onColumnsChange([...columns, column]);
    setNewColumn({
      columnLetter: "",
      columnName: "",
      fieldType: "custom",
      isRequired: false,
    });
  };

  const handleEditColumn = (column: SpreadsheetColumn) => {
    setEditingColumn({ ...column });
  };

  const handleUpdateColumn = () => {
    if (!editingColumn) return;

    const updatedColumns = columns.map(col => 
      col.id === editingColumn.id ? editingColumn : col
    );
    onColumnsChange(updatedColumns);
    setEditingColumn(null);
  };

  const handleDeleteColumn = (columnId: string) => {
    const updatedColumns = columns.filter(col => col.id !== columnId);
    onColumnsChange(updatedColumns);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Configuração de Colunas da Planilha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new column section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-4">Adicionar Nova Coluna</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <Label htmlFor="columnLetter">Letra da Coluna</Label>
              <Input
                id="columnLetter"
                placeholder="Ex: A, B, C..."
                value={newColumn.columnLetter}
                onChange={(e) => setNewColumn({ ...newColumn, columnLetter: e.target.value })}
                className="uppercase"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="columnName">Nome da Coluna</Label>
              <Input
                id="columnName"
                placeholder="Ex: Título, Descrição..."
                value={newColumn.columnName}
                onChange={(e) => setNewColumn({ ...newColumn, columnName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fieldType">Tipo de Campo</Label>
              <select
                id="fieldType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newColumn.fieldType}
                onChange={(e) => setNewColumn({ ...newColumn, fieldType: e.target.value as SpreadsheetColumn['fieldType'] })}
              >
                {fieldTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRequired"
                checked={newColumn.isRequired}
                onChange={(e) => setNewColumn({ ...newColumn, isRequired: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isRequired" className="text-sm">Obrigatório</Label>
            </div>
            <Button onClick={handleAddColumn} disabled={!newColumn.columnLetter || !newColumn.columnName}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Existing columns list */}
        <div>
          <h4 className="font-medium mb-4">Colunas Configuradas</h4>
          {columns.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma coluna configurada. Adicione colunas para começar a ler dados da planilha.
            </p>
          ) : (
            <div className="space-y-2">
              {columns
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((column) => (
                <div key={column.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingColumn?.id === column.id ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <Input
                        value={editingColumn.columnLetter}
                        onChange={(e) => setEditingColumn({ ...editingColumn, columnLetter: e.target.value.toUpperCase() })}
                        className="w-20 uppercase"
                        maxLength={5}
                      />
                      <Input
                        value={editingColumn.columnName}
                        onChange={(e) => setEditingColumn({ ...editingColumn, columnName: e.target.value })}
                        className="flex-1"
                      />
                      <select
                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={editingColumn.fieldType}
                        onChange={(e) => setEditingColumn({ ...editingColumn, fieldType: e.target.value as SpreadsheetColumn['fieldType'] })}
                      >
                        {fieldTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={editingColumn.isRequired}
                          onChange={(e) => setEditingColumn({ ...editingColumn, isRequired: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-xs">Obr.</span>
                      </div>
                      <Button size="sm" onClick={handleUpdateColumn}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingColumn(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-4 flex-1">
                        <span className="font-mono font-bold text-blue-600 w-8">{column.columnLetter}</span>
                        <span className="font-medium">{column.columnName}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {fieldTypeOptions.find(opt => opt.value === column.fieldType)?.label}
                        </span>
                        {column.isRequired && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditColumn(column)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteColumn(column.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
