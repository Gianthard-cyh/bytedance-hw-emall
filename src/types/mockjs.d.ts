declare module 'mockjs' {
  const Mock: {
    mock<T = unknown>(template: unknown): T
  }
  export default Mock
}
