package com.infy.ecommerce.JWT;

public class AuthenticateResponse {

     public String jwtToken;
     

	public AuthenticateResponse() {

	}

	public AuthenticateResponse(String jwtToken) {
		this.jwtToken = jwtToken;
	}

	public String getJwtToken() {
		return jwtToken;
	}
	
}
