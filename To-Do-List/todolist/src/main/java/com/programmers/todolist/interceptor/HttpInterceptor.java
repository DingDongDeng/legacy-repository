package com.programmers.todolist.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;


public class HttpInterceptor extends HandlerInterceptorAdapter {//xml�� ������ �����Ǿ�����
	
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

		if(mail==null ) {//�α����� ���ϰ�, �α����������� �ƴ� ���� �����Ҷ�
			if(!(path.equals("login"))) {
				response.sendRedirect(this.path+"/login");
				return false;
			}
		}
		else {//�α����� �ϰ� �α����������� �����Ҷ�,list�������� ��������
			if(path.equals("login")||path.equals("todolist")) {
				response.sendRedirect(this.path+"/list");
				return false;
			}
		}
		
		return true;
	}	

}
