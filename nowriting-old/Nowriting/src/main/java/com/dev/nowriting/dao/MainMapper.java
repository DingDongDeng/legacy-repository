package com.dev.nowriting.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.dev.nowriting.dto.ContentDTO;
import com.dev.nowriting.dto.MemberDTO;
import com.dev.nowriting.dto.ProjectDTO;

public interface MainMapper {
	public void insertProject(@Param("pName") String pName, 
							  @Param("mail") String mail);
	
	public ArrayList<ProjectDTO> getProjectList(@Param("mail") String mail);
	
	public void deleteProject(@Param("mail") String mail, 
							  @Param("pId") String pId, 
							  @Param("pName") String pName);
	
	public int contentCnt(@Param("pId") String pId,
						  @Param("page") String page);
	
	public void insertContent(@Param("pId") String pId,
							  @Param("page") String page,
							  @Param("content") String content);
	
	public void updateContent(@Param("pId") String pId,
							  @Param("page") String page,
							  @Param("content") String content);
	
	public ArrayList<ContentDTO> findContentMaxPage(@Param("pId") String pId);
	
	public ArrayList<ContentDTO> findContentPage(@Param("pId") String pId,
												@Param("page") String page);
	
	public void deleteContentPage(@Param("pId") String pId,
								  @Param("page") String page);
	
	public ArrayList<ContentDTO> getContentList(@Param("pId") String pId);
	
	
	
}
