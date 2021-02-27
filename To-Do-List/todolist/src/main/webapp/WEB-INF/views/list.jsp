<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"  %>
<% request.setCharacterEncoding("utf-8"); %>
<html>
<body>
	<!-- 비동기 동작시 대기화면 생성 -->
	<jsp:include page="waiting.jsp" flush="false"/>	
	<div class="listPage">
		<div class="header">
			<div class="guide shadow">
				진행중 <div class="sample grayBorder"></div>&nbsp;
				처리완료 <div class="sample greenBorder"></div>&nbsp;
				기한초과 <div class="sample redBorder"></div>&nbsp;
			</div>
			<input class= "shadow" type="button" name="add">
		</div>
		<div class="list">
			<c:forEach var='item' items='${listDTOs}'>
				<div class="item" >
					<div class="info hidden">
						<div class="priority">${item.priority}</div>
						<div class="state">${item.state}</div>
					</div>
					<div class="cover ">
						<div class="target shadow">
							<div class="title">
								${item.title}
							</div>
							<div class="date">
								${fn:substring(item.deadline,0,16)}	
							</div>
						</div>
						<input  type="checkbox" name="check">
					</div>
					<div class="detail hidden">
						<div class="shadow">
							<div class="_content selector">
								${item.content}
							</div>
							<div class="edit">
								<input class="shadow" type="button" name="modify">
								<input class="shadow" type="button" name="delete">
							</div>
						</div>
						<span>
							<input class="shadow" type="button" name="up"><br>
							<input class="shadow" type="button" name="down">
						</span>
					</div>
				</div>
			</c:forEach>
		</div>
	</div>
	<jsp:include page="baseJS.jsp" flush="false"/>
	<script src="${pageContext.request.contextPath}/resources/js/list.js?version=<%=System.currentTimeMillis() %>"></script>
</body>
</html>
