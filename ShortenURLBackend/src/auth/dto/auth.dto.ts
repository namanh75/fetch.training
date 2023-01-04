export class AuthDto {
  token_type: string;
  access_token_name: string;
  access_token_expires_in: string;
  refresh_token_name: string;
  refresh_token_expired: Date;

  constructor() {}

  loginMethod(
    token_type: string,
    access_token_name: string,
    access_token_expires_in: string,
    refresh_token_name: string,
    refresh_token_expired: Date,
  ) {
    this.token_type = token_type;
    this.access_token_name = access_token_name;
    this.access_token_expires_in = access_token_expires_in;
    this.refresh_token_name = refresh_token_name;
    this.refresh_token_expired = refresh_token_expired;
    return this;
  }

  logout() {
    return {
      message: 'Đã đăng xuất thành công, token không còn được sử dụng',
    };
  }
  refreshMethod(access_token_name: string) {
    this.access_token_name = access_token_name;
    return this;
  }
}
