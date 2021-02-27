package com.programmers.todolist.dao;

import java.sql.Timestamp;
import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.programmers.todolist.dto.ListDTO;

public interface ListMapper {
	public ArrayList<ListDTO> selectDeadlineOverList(@Param("mail") String mail);
	public void updatePriorityUpDown(@Param("mail")String mail,
								@Param("priority1") int priority1,
								@Param("priority2") int priority2);
	public void updateState(@Param("mail") String mail,
							@Param("priority") int priority,
							@Param("state") String state);
	public void updatePriorityAfterDelete(@Param("mail")String mail,
								@Param("priority") int priority);
	public void updateListWithDate(@Param("listDTO") ListDTO listDTO);
	public void updateList(@Param("listDTO") ListDTO listDTO);
	public int selectMaxPriority(@Param("mail")String mail);
	public void deleteList(@Param("mail") String mail,
							@Param("priority") int priority);
	public ArrayList<ListDTO> selectList(@Param("mail") String mail);
	public void insertListWithDate(@Param("listDTO") ListDTO listDTO);
	public void insertList(@Param("listDTO") ListDTO listDTO);
	public int cntList(@Param("mail") String mail);
}
