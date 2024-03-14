package com.infy.ecommerce.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SpringSecurityConfigurer{
	@Autowired
	AuthenticationManager authenticationManger;  
	
	@Autowired
	UserDetailsService myuserDeatailsService;

	  public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(myuserDeatailsService);
	  }
	  
	  
		@Bean
		SecurityFilterChain configureHttp(HttpSecurity http) throws Exception {

			http.authorizeHttpRequests(auth -> auth.
					requestMatchers("/authenticate").permitAll()
					.anyRequest().authenticated());
			
			return http.build();
		}
		
	
	
	  @Bean
	  public PasswordEncoder passwordEncoder() {
		  return NoOpPasswordEncoder.getInstance();
	  }
	  
}
