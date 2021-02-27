package com.dev.nowriting.service.validate;

import java.util.Map;

public interface ValidateService {
	
	public Map execute(Map map);
	/*
	 * map의 반환 내용은
	 * {
	 * STATE : 상태
	 * DETAIL : 세부내용
	 * }
	 * 
	 * 형태여야함
	 * 
	 */
	
}
