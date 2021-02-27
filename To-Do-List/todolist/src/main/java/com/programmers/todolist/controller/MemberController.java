package com.programmers.todolist.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.programmers.todolist.dto.MemberDTO;
import com.programmers.todolist.service.MemberServiceImpl;

/**
 * Handles requests for the application home page.
 */
@Controller
public class MemberController {
	@Autowired
	SqlSession sqlSession;
	@Autowired
	MemberServiceImpl memberService;
	
	@RequestMapping(value = {"/","/login"}, method = RequestMethod.GET)
	public ModelAndView login(ModelAndView mv) {
		mv.setViewName("login");
		return mv;
	}
	@ResponseBody
	@RequestMapping(value = {"/loginProcess"}, method = RequestMethod.POST)
	public Map loginProcess(HttpSession session, @RequestBody MemberDTO memberDTO) {
		System.out.println("------------로그인 시도-----");
		System.out.println("mail : " + memberDTO.getMail());
		System.out.println("password : " + memberDTO.getPassword());
		Map result = memberService.loginCheck(memberDTO);
		
		if(result.get("STATE").equals("SUCCESS")) {
			session.setAttribute("mail", memberDTO.getMail());
		}
		return result;
	}
	@RequestMapping(value = {"/signUp"}, method = RequestMethod.GET)
	public ModelAndView signUp(ModelAndView mv) {
		
		mv.setViewName("signUp");
		
		return mv;
	}
	@ResponseBody
	@RequestMapping(value = {"/signUpProcess"}, method = RequestMethod.POST)
	public Map signUp(@RequestBody Map<String,Object> userInfo, HttpSession session) {
		String mail = (String) userInfo.get("mail");
		String password =(String) userInfo.get("password");
		String passwordCheck =(String) userInfo.get("passwordCheck");
		
		Map result = memberService.signUpCheck(mail, password, passwordCheck);
		if(result.get("STATE").equals("SUCCESS")) {
			
		}
		
		return result;
	}
	@RequestMapping(value = {"/checkAuth"}, method = RequestMethod.GET)
	public ModelAndView checkAuth(@RequestParam(value="mail") String mail, 
									@RequestParam(value="authKey") String authKey,
									ModelAndView mv) {
		System.out.println(mail);
		System.out.println(authKey);
		memberService.authCheck(mail, authKey);
		mv.setViewName("redirect:login");
		
		return mv;
	}
	@ResponseBody
	@RequestMapping(value = {"/findPW"}, method = RequestMethod.POST)
	public Map findPW(@RequestBody String mail) {
		mail= mail.substring(1,mail.length()-1);//json문자열로 와서 큰따옴표제거
		Map result = memberService.findPW(mail);
		
		return result;
	}
	
	
	@RequestMapping(value = {"/logout"}, method = RequestMethod.GET)
	public ModelAndView logout(HttpSession session, ModelAndView mv) {
		
		mv.setViewName("redirect:/login");
		session.invalidate();
		
		return mv;
	}
	
	
}
