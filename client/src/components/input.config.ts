interface ColumnConfig {
  type: 'Checkbox' | 'Radio' | 'Button';
  isDraggable: boolean;
}

const inputConfig: {
  columns: Record<string, ColumnConfig>; 
} = {
  columns: {
    A: { type: 'Checkbox', isDraggable: true },
    B: { type: 'Radio', isDraggable: false },
    C: { type: 'Button', isDraggable: true },
  },
};

export default inputConfig;