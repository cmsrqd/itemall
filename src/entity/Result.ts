/**
 * 统一结果对象
 */
export class Result {
  /**
   * 成功
   * @param data
   * @param message
   */
  static success(data: any, message?: string) {
    return { code: 200, data, message, date: new Date() };
  }
  /**
   * 失败
   * @param data
   * @param message
   */
  static fail(code: number, message?: string) {
    return { code, message, date: new Date() };
  }
}
