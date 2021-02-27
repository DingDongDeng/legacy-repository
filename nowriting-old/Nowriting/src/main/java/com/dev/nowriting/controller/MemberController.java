package com.dev.nowriting.controller;


import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.dev.nowriting.service.member.MemberChangeMyInfoService;
import com.dev.nowriting.service.member.MemberFindInfoService;
import com.dev.nowriting.service.member.MemberMyInfoService;
import com.dev.nowriting.service.member.MemberSecessionService;
import com.dev.nowriting.service.member.MemberSignUpMailService;
import com.dev.nowriting.service.member.MemberSignUpService;
import com.dev.nowriting.service.validate.ValidateChangeMyInfoService;
import com.dev.nowriting.service.validate.ValidateFindInfoService;
import com.dev.nowriting.service.validate.ValidateLogInService;
import com.dev.nowriting.service.validate.ValidateSecessionService;
import com.dev.nowriting.service.validate.ValidateSignUpService;
import com.dev.nowriting.util.ValidateObject;

/**
 * Handles requests for the application home page.
 */
//@SessionAttributes({"id","task"})
@Controller
public class MemberController {
	
	private static final Logger logger = LoggerFactory.getLogger(MemberController.class);
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@Autowired
	ValidateObject validateObject; 
	@Autowired
	ValidateLogInService validateLogInService;
	@Autowired
	ValidateSignUpService validateSignUpService;
	@Autowired
	ValidateChangeMyInfoService validateChangeMyInfoService;
	@Autowired
	ValidateSecessionService validateSecessionService;
	@Autowired
	ValidateFindInfoService validateFindInfoService;
	
	@Autowired
	MemberSignUpService memberSignUpService;
	@Autowired
	MemberSignUpMailService memberSignUpMailService;
	@Autowired
	MemberMyInfoService memberMyInfoService;
	@Autowired
	MemberChangeMyInfoService memberChangeMyInfoService;
	@Autowired
	MemberSecessionService memberSecessionService;
	@Autowired
	MemberFindInfoService memberFindInfoService;
	
	
	 
	
	
	@RequestMapping(value= {"/","/login"}, method= RequestMethod.GET)
	public ModelAndView login(ModelAndView mv, HttpSession session) {
		if(sessionCheck("mail", session)) {
			mv.setViewName("redirect:/project");
			return mv;
		}
		mv.setViewName("loginForm");
		mv.addObject("viewName","login");
		return mv;
	}
	
	@ResponseBody
	@RequestMapping(value= {"/login.check"},method = RequestMethod.POST)
	public Map loginCheck(@RequestBody Map<String,Object> user,Model model,HttpSession session) {
		
		
		Map result = validateLogInService.execute(user);
		String state = (String)result.get("STATE");
		String detail = (String)result.get("DETAIL");
		
		if(state.equals(validateObject.getInitState())&&detail.equals(validateObject.getInitDetail("login"))) {
			session.setAttribute("mail", user.get("mail"));
			session.setAttribute("task", user.get("task"));
			result.put("task", user.get("task"));
			
		}
		
		return result;
	}
	
	@RequestMapping(value= {"/logout"}, method= RequestMethod.GET)
	public ModelAndView logout(ModelAndView mv, HttpServletRequest request,HttpSession session) {
		session.invalidate();
		mv.setViewName("loginForm");
		mv.addObject("viewName","login");
		
		return mv;
	}
	
	@RequestMapping(value= {"/signupFirst"}, method = RequestMethod.GET)
	public ModelAndView signUpFirst(ModelAndView mv) {
		
		mv.setViewName("subForm");
		mv.addObject("viewName","signupFirst");
		
		return mv;
	}
	
	@ResponseBody
	@RequestMapping(value= {"/signup.check","/signupMail.check"}, method = RequestMethod.POST)
	public Map signUpProcess(@RequestBody Map<String, Object> signUp, HttpServletRequest request) {
		
		//아이디 중복 요청인지 , 회원가입 요청인지 구분
		String URI = request.getRequestURI();  
		String[] temp = URI.split("/");
		String path =temp[temp.length-1]; 
		
		if(path.equals("signupMail.check")) {
			signUp.put("checkOnlyMail", true);
		}
		else if(path.equals("signup.check")) {
			signUp.put("checkOnlyMail", false);
		}
		else {
			try {
				throw new Exception();
			}
			catch(Exception e) {
				e.printStackTrace();
				System.out.println("URI 경로 에러 : {/signup.check, /signupMail.check}가 아님");
				System.out.println("URI : " + path);
			}
		}
		
		Map result = validateSignUpService.execute(signUp);
		String state = (String) result.get("STATE");
		String detail = (String) result.get("DETAIL");
		if(state.equals("SUCCESS") && detail.equals("SUCCESS_SIGN_UP")) {
			memberSignUpService.execute(signUp);
		}		
		
		return result;
	}
	@RequestMapping(value= {"/signupSecond"}, method = RequestMethod.GET)
	public ModelAndView signUpSecond(ModelAndView mv) {
		
		mv.setViewName("subForm");
		mv.addObject("viewName","signupSecond");
		
		return mv;
	}
	@RequestMapping(value= {"/signupThird"}, method = RequestMethod.GET)
	public ModelAndView signUpThird(@RequestParam(value="mail") String mail, @RequestParam(value="authKey") String authKey,
			ModelAndView mv) {
		Map<String,Object> param = new HashMap<String, Object>();
		param.put("mail", mail);
		param.put("authKey", authKey);
				
		memberSignUpMailService.execute(param);		
		mv.setViewName("subForm");
		mv.addObject("viewName","signupThird");
				
		return mv;
	}
	
	@RequestMapping(value= {"/myInfo"}, method = RequestMethod.GET)
	public ModelAndView myInfo(ModelAndView mv, HttpSession session) {

		if(!sessionCheck("mail", session)) {
			mv.setViewName("redirect:/login");
			return mv;
		}
		Map result = new HashMap<String, Object>();
		String mail = (String) session.getAttribute("mail");
		result.put("mail", mail);
		memberMyInfoService.execute(result);
		
		mv.setViewName("subForm");
		mv.addObject("viewName","myInfo");
		mv.addObject("result", result);

		return mv;
	}
	@ResponseBody
	@RequestMapping(value= {"/changeMyInfo"}, method = RequestMethod.POST)
	public Map changeMyInfo(@RequestBody Map<String,Object> info, HttpSession session) {
		
		Map result = validateObject.initResultMap("changeMyInfo");
		if(!validateObject.checkSessionMail(session, result))return result;
		info.put("mail", (String) session.getAttribute("mail"));
		result.put("info", info);
		result = validateChangeMyInfoService.execute(result);
		String STATE = (String)result.get("STATE");
		if(STATE.equals("SUCCESS")) {
			memberChangeMyInfoService.execute(info);
		}
	
		return result;
	}
	
	@RequestMapping(value= {"/secession"}, method = RequestMethod.GET)
	public ModelAndView secession(ModelAndView mv, HttpSession session) {
		
		mv.setViewName("secession");
		return mv;
	}
	
	@ResponseBody
	@RequestMapping(value= {"/secessionCheck"}, method = RequestMethod.POST)
	public Map secessionCheck(@RequestParam("data") String pw, HttpSession session) {
		//secession
		Map result = validateObject.initResultMap("secession");
		if(!validateObject.checkSessionMail(session, result))return result;
		result.put("mail",(String) session.getAttribute("mail"));
		result.put("pw", pw);
		result = validateSecessionService.execute(result);
		String STATE = (String)result.get("STATE");
		
		if(STATE.equals("SUCCESS")) {
			memberSecessionService.execute(result);
			session.invalidate();
		}
	
		return result;
	}
	
	@RequestMapping(value= {"/findInfo"}, method = RequestMethod.GET)
	public ModelAndView findInfo(ModelAndView mv, HttpSession session) {
		
		mv.setViewName("findInfo");
		return mv;
	}
	
	@ResponseBody
	@RequestMapping(value= {"/findInfoCheck"}, method = RequestMethod.POST)
	public Map findInfoCheck(@RequestParam("data") String mail, HttpSession session) {
		Map result = validateObject.initResultMap("findInfo");
		result.put("mail", mail);
		result = validateFindInfoService.execute(result);
		
		String STATE = (String) result.get("STATE");
		if(STATE.equals("SUCCESS")) {
			memberFindInfoService.execute(result);
		}
		
		return result;
	}
	
	public boolean sessionCheck(String key, HttpSession session) {
		
		if(session.getAttribute(key)==null)
			return false;
		
		return true;
	}
	

}



