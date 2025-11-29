import React from 'react'

interface BrutalistTableColumn<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface BrutalistTableProps<T> {
  columns: BrutalistTableColumn<T>[]
  data: T[]
  onRowClick?: (row: T) => void
}

export const BrutalistTable = <T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
}: BrutalistTableProps<T>): React.ReactElement => {
  const tableClasses = 'w-full border-2 border-[#ffffff] border-collapse'

  const headerClasses =
    'bg-[#0a0a0a] text-[#f5f5f5] font-bold uppercase tracking-wide text-left'

  const headerCellClasses = 'px-4 py-3 border-2 border-[#ffffff]'

  const rowClasses = (index: number) =>
    [
      'border-b',
      'border-[#404040]',
      'transition-colors',
      'duration-75',
      onRowClick ? 'cursor-pointer hover:bg-[#1a1a1a]' : '',
      index % 2 === 0 ? 'bg-[#121212]' : 'bg-[#0a0a0a]',
    ]
      .filter(Boolean)
      .join(' ')

  const cellClasses = 'px-4 py-3 text-[#f5f5f5] border border-[#404040]'

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, row: T) => {
    if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onRowClick(row)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses} role="table">
        <thead className={headerClasses}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={headerCellClasses}
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-[#8a8a8a] uppercase"
              >
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowClasses(rowIndex)}
                onClick={() => handleRowClick(row)}
                onKeyDown={(e) => handleKeyDown(e, row)}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className={cellClasses}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

BrutalistTable.displayName = 'BrutalistTable'
