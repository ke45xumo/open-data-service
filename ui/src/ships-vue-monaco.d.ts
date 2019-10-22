declare module 'vue-monaco' {
  import { VueConstructor } from 'vue'

  export interface MonacoEditorProps {
    original: string;
    value: string;
    theme: string;
    language: string;
    option: object;
    amdRequre: Function;
    diffEditor: boolean;
  }

  export interface MonacoEditorConstructor extends VueConstructor {
    props: MonacoEditorProps;
    data: () => void;
    methods: any;
  }

  export const MonacoEditor: MonacoEditorConstructor
  export default MonacoEditor
}
