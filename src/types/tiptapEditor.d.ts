export interface TiptapEditorComponent {
  getHTML: () => string
  updateEditorContent: (htmlcontent: string) => null
}
export declare type Level = 1 | 2 | 3 | 4 | 5 | 6
