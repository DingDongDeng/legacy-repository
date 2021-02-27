package com.dev.nowriting.service.main;

import java.util.Map;

public interface MainService {
	public void execute(Map map);
	/*
	 * 기본적으로는 아무것도 리턴을 하지 않지만(add,delete,update)
	 * 만약 값을 리턴해야할필요가 있다면(select, 또는 상태를묘사하는 map{STATE:...., DETAIL:....)
	 * map객체에 넣어서 활용하도록 한다.
	 */
}
