const INFO = {
  valid: true
};

module.exports = {
  email: {
    validator: (value) => {
      const REG = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      const IS_VALID = REG.test(value);
      const ERROR = {
        valid: false,
        msg: '邮件格式不合法'
      };
      return IS_VALID ? INFO : ERROR;
    }
  },
  phone: {
    validator: (value) => {
      const REG = /^1[34578]\d{9}$/;
      const IS_VALID = REG.test(value);
      const ERROR = {
        valid: false,
        msg: '手机号错误,请填写正确的手机号'
      };
      return IS_VALID ? INFO : ERROR;
    }
  }
};
