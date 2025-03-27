export enum Code {
  /* 成功状态码 */
  SUCCESS = 10000, // "成功"

  /* 参数相关：20001-29999 */
  PARAM_IS_INVALID = 20001, // "参数无效"
  PARAM_IS_BLANK = 20002, // "参数为空"
  PARAM_TYPE_ERROR = 20003, // "参数类型错误"
  PARAM_NOT_COMPLETE = 20004, // "参数缺失"
  ILLEGAL_REQUEST = 20006, // "非法请求"

  /* 账号相关：30001-39999*/
  USER_NOT_LOGGED_IN = 30001, // "用户未登录"
  USER_LOGIN_ERROR = 30002, // "账号或密码错误"
  USER_ACCOUNT_LOCKED = 30003, // "账号已被锁定"
  USER_NOT_EXIST = 30004, // "用户不存在"
  PHONE_HAS_USED = 30005, // "该手机号已被注册"
  SMS_CODE_EXPIRE = 30006, // "短信验证码已失效"
  SMS_CODE_ERROR = 30007, // "短信验证码错误"

  /* 权限错误：40001-49999 */
  PERMISSION_NO_ACCESS = 40001, // "您没有权限访问"
  REPEAT_LOGIN = 40002, // "您的账号已在其他设备上重复登录"
  PERMISSION_NO_SUFFICIENT = 40003, // "权限不足"

  /* 接口错误：60001-69999 */
  INTERFACE_INNER_INVOKE_ERROR = 60001, // "内部系统接口调用异常"
  INTERFACE_OUTTER_INVOKE_ERROR = 60002, // "外部系统接口调用异常"
  INTERFACE_FORBID_VISIT = 60003, // "该接口禁止访问"
  INTERFACE_ADDRESS_INVALID = 60004, // "接口地址无效"
  INTERFACE_REQUEST_TIMEOUT = 60005, // "接口请求超时"
  INTERFACE_EXCEED_LOAD = 60006, // "接口负载过高"
  INTERFACE_TALKWORK_ERROR = 60007, // "话术变量替换失败"
  INTERFACE_SMSID_ERROR = 60008, // "短信发送失败"
  INTERFACE_PROVIDER_ERROR = 60009, // "服务提供方接口内部异常"

  /* 系统错误：90001-99999 */
  SYSTEM_INNER_BUSY = 90001, // "系统繁忙，请稍后重试"
  SYSTEM_INNER_ERROR = 99999, // "系统内部异常"
}

export const CodeMessage: {
  [key in Code]: string;
} = {
  /* 成功状态码 */
  [Code.SUCCESS]: '成功',

  /* 参数相关：20001-29999 */
  [Code.PARAM_IS_INVALID]: '参数无效',
  [Code.PARAM_IS_BLANK]: '参数为空',
  [Code.PARAM_TYPE_ERROR]: '参数类型错误',
  [Code.PARAM_NOT_COMPLETE]: '参数缺失',
  [Code.ILLEGAL_REQUEST]: '非法请求',

  /* 账号相关：30001-39999*/
  [Code.USER_NOT_LOGGED_IN]: '用户未登录',
  [Code.USER_LOGIN_ERROR]: '账号或密码错误',
  [Code.USER_ACCOUNT_LOCKED]: '账号已被锁定',
  [Code.USER_NOT_EXIST]: '用户不存在',
  [Code.PHONE_HAS_USED]: '该手机号已被注册',
  [Code.SMS_CODE_EXPIRE]: '短信验证码已失效',
  [Code.SMS_CODE_ERROR]: '短信验证码错误',

  /* 权限错误：40001-49999 */
  [Code.PERMISSION_NO_ACCESS]: '您没有权限访问',
  [Code.REPEAT_LOGIN]: '您的账号已在其他设备上重复登录',
  [Code.PERMISSION_NO_SUFFICIENT]: '权限不足',

  /* 接口错误：60001-69999 */
  [Code.INTERFACE_INNER_INVOKE_ERROR]: '内部系统接口调用异常',
  [Code.INTERFACE_OUTTER_INVOKE_ERROR]: '外部系统接口调用异常',
  [Code.INTERFACE_FORBID_VISIT]: '该接口禁止访问',
  [Code.INTERFACE_ADDRESS_INVALID]: '接口地址无效',
  [Code.INTERFACE_REQUEST_TIMEOUT]: '接口请求超时',
  [Code.INTERFACE_EXCEED_LOAD]: '接口负载过高',
  [Code.INTERFACE_TALKWORK_ERROR]: '话术变量替换失败',
  [Code.INTERFACE_SMSID_ERROR]: '短信发送失败',
  [Code.INTERFACE_PROVIDER_ERROR]: '服务提供方接口内部异常',

  /* 系统错误：90001-99999 */
  [Code.SYSTEM_INNER_BUSY]: '系统繁忙，请稍后重试',
  [Code.SYSTEM_INNER_ERROR]: '系统内部异常',
};
