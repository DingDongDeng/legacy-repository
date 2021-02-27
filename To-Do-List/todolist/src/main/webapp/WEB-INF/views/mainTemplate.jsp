<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
	<title>Programmers TODO</title>
	<link href="https://fonts.googleapis.com/css?family=Baloo+Bhai|Do+Hyeon&display=swap" rel="stylesheet">
	<link rel="stylesheet" type="text/css" media="(max-width :1024px)" href="${pageContext.request.contextPath}/resources/css/mainTemplateMobile.css">
	<link rel="stylesheet" type="text/css" media="(min-width :1025px)" href="${pageContext.request.contextPath}/resources/css/mainTemplatePC.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/background.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/list.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/listEdit.css">

</head>
<body>
	<div class="sideBar">
		<div class="title">
			<h1>Programmers </h1>
			<h2>TODO</h2>
		</div>
		<div class="content">
			<div>
				<input type="button" name="logout">
			</div>
			<div>
				<input class="hidden" type="button" name="setting" value="톱니">
			</div>
			<div>
				<span class="alert hidden"></span>
				<input type="button" name="alert">
				<div class="bubble" style="display:none">
					<div style="text-align:center">
						<h3 style="margin:0px;">Over DeadLine List</h3>
					</div>
					<div class="alertForm">
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="template">
		<div class="content">
			<jsp:include page="list.jsp" flush="false"/>
			<jsp:include page="listEdit.jsp" flush="false"/>
		</div>
	</div>

	<script src="${pageContext.request.contextPath}/resources/js/mainTemplate.js?version=<%=System.currentTimeMillis() %>"></script>
	<script type="text/javascript"></script>
	<script>
	
		
		/*
		* 실시간알림★
		*  firstDeadDate 라는 기한이 가장 빠른 날짜를 저장하여,
		* DB에 상시 쿼리하는 것이 아닌 조건부 쿼리를 통해 서버의 부담을 줄이고자하였음(그러나 가장이상적인것은 스케쥴링과 소켓)
		* 그러나 악의적인 사용자가 스크립트를 변조할 수 도 있음으로 
		* 이와 같은 알고리즘을 서버에서 적용하는 것이 안전하다고 생각됨
		*/
		
		if("${mail}"!=""){			
			alertList();
			setInterval(function(){
				let period = parseInt(new Date().getTime())-parseInt(new Date(firstDeadDate).getTime());
				if(period>0){
					console.log("알람요청!!!");
					alertList();
					setColor();

				}
			}, 1000);	
		}

		
		
		
	</script>
</body>
</html>
