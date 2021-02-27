<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<style>
		#addButton{
				
			text-align : center;			
		}
		
		#addButton div{
			display: inline-block;
			width : 48px;
			height : 48px;	
			background: url("${pageContext.request.contextPath}/resources/img/plus.png" ) no-repeat;
			margin-top : 10px;
		}
		.border{
			border : 1px solid black;
			border-radius: 10px;
			
			margin-left: auto;
			margin-right : auto;
			margin-top : 15px;
		}
		.over{
			overflow-y: scroll;
		}
		#inputUI{
			border : 2px solid black;
			width : 250px;
			height : 60px;
			padding : 10px;
			
			margin-top : 50px;
			margin-left:auto;
			margin-right: auto;
			text-align : center;
		}
		
		#inputUI input[type=text]{
			width:250px;
			height:30px;
			margin-bottom : 10px;
			font-size : 1.6em;
		}
		
		#projectList{
			width: 100%;
			height: 650px;
			text-align : center;
		}
		#projectList > .project{
			width: 70%;
		}
		.hidden{
			display: none;
		}
		
		.x{
			display : inline-block;
			height : 48px;
			width : 48px;
			background: url("${pageContext.request.contextPath}/resources/img/x.png" ) no-repeat;
		}
	</style>
</head>
<body>
	 <div class="content">
	 	<div class="title">
	 		<h3>프로젝트 리스트</h3>
	 	<div class="buttons">
	 		<input  id="download" type="button" value="다운로드(txt)"><br>
	 	</div>
	 	
	 	</div>
		<div>
			<div id="projectList" class="over">
				<c:forEach var='project' items='${projectList}'>
					<div class="border project">
						<div class='x' id="x" style='float:right'></div>
						<h1 data-pid='${project.pId }' class='projectName'> ${project.pName}</h1>
					</div>
				</c:forEach>
				<div id="addButton">
					<div></div>
				</div>
			</div>
		</div>
		<div class="hidden">
			<form id="form" action="${pageContext.request.contextPath}/content" method="post">
				<input type="text" name="pId"><br>
				<input type="text" name="pName">
			</form>
		</div>
	</div>

	<jsp:include page="includeJSP/baseJS.jsp" flush="false"/>
	<script src="${pageContext.request.contextPath}/resources/js/project.js?version=<%=System.currentTimeMillis() %>"></script>
</body>
</html>
