package com.salessavvy.app.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.salessavvy.app.serviceImplementation.AuthServiceImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final AuthServiceImpl authServiceImpl;

	public JwtAuthenticationFilter(AuthServiceImpl authServiceImpl) {
		this.authServiceImpl = authServiceImpl;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		System.out.println("JWT FILTER -> " + request.getMethod() + " " + request.getRequestURI());

		String token = getJwtFromCookie(request);

		if (token != null && authServiceImpl.validateToken(token)) {

			String username = authServiceImpl.extractUsername(token);

			UserDetails userDetails = authServiceImpl.loadUserByUsername(username);

			UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails,
					null, userDetails.getAuthorities());

			authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

			SecurityContextHolder.getContext().setAuthentication(authentication);

//			filterChain.doFilter(request, response);
		}
		filterChain.doFilter(request, response);
	}

	private String getJwtFromCookie(HttpServletRequest request) {

		if (request.getCookies() == null)
			return null;

		for (Cookie cookie : request.getCookies()) {

			if ("jwt".equals(cookie.getName())) {
				return cookie.getValue();
			}
		}

		return null;
	}
}