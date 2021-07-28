class BaseModal {
  constructor(msg) {
    this.msg = msg;
  }
}

class SuccessModal extends BaseModal {
  constructor(msg) {
    super(msg);
    this.code = 0;
  }
}

class ErrorModal extends BaseModal {
  constructor(msg) {
    super(msg);
    this.code = -1;
  }
}

module.exports = {
  SuccessModal,
  ErrorModal,
};
