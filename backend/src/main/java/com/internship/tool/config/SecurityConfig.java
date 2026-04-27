package com.internship.tool.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

 @Bean
 public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http
   .csrf(csrf -> csrf.disable())
   .authorizeHttpRequests(auth -> auth
    .anyRequest().authenticated()
   )
   .httpBasic(); // ✅ VERY IMPORTANT

  return http.build();
 }

 // ✅ USERS
 @Bean
 public UserDetailsService users() {
  return new InMemoryUserDetailsManager(

   User.withUsername("admin")
    .password("{noop}admin")
    .roles("ADMIN")
    .build(),

   User.withUsername("user")
    .password("{noop}user")
    .roles("USER")
    .build()
  );
 }
}