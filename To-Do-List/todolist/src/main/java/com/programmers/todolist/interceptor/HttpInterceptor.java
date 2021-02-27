package com.programmers.todolist.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;


public class HttpInterceptor extends HandlerInterceptorAdapter {//xml에 빈으로 생성되어있음
	
	@Value("${host.contextPath}")
	String path;
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		HttpSession session = request.getSession();
		String mail = (String)session.getAttribute("mail");
		String URI = request.getRequestURI();  
		String[] temp = URI.split("/");
		String path =temp[temp.length-1]; 

		if(mail==null ) {//로그인을 안하고, 로그인페이지가 아닌 곳을 접근할때
			if(!(path.equals("login"))) {
				response.sendRedirect(this.path+"/login");
				return false;
			}
		}
		else {//로그인을 하고 로그인페이지로 접근할때,list페이지로 돌려보냄
			if(path.equals("login")||path.equals("todolist")) {
				response.sendRedirect(this.path+"/list");
				return false;
			}
		}
		
		return true;
	}	

}
