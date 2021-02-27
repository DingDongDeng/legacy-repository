package com.programmers.todolist.service;

import java.util.ArrayList;
import java.util.Map;

import com.programmers.todolist.dto.ListDTO;

public interface ListService {
	public ArrayList<ListDTO> alertList(String mail);
	public Map listUp(String mail, int priority);
	public Map listDown(String mail, int priority);
	public Map listComplete(ListDTO listDTO);
	public Map listUpdate(ListDTO listDTO);
	public Map listAdd(ListDTO listDTO);
	public ArrayList<ListDTO> showList(String mail);
	public Map listDelete(String mail, int priority);
}
