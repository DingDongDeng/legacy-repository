<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<style>
		.img{
			width: 80%;
			margin-left : auto;
			margin-right : auto;
		}
		#img1{
			margin-top : 10px;
			display:inline-block;
			width : 190px;
			height : 64px;	
			background: url("${pageContext.request.contextPath}/resources/img/project_explain_1.png" ) no-repeat;
		}
		#img2{
			margin-top : 10px;
			display:inline-block;
			width : 50px;
			height : 50px;
			background: url("${pageContext.request.contextPath}/resources/img/plus.png" ) no-repeat;
		}
		#img3{
			margin-top : 10px;
			display:inline-block;
			width : 500px;
			height : 100px;
			background: url("${pageContext.request.contextPath}/resources/img/project_explain_2.png" ) no-repeat;
		}
		#img4{
			margin-top : 10px;
			display:inline-block;
			width : 50px;
			height : 50px;
			background: url("${pageContext.request.contextPath}/resources/img/x.png" ) no-repeat;
		}
	</style>
</head>
<body>
	 <div class="content">
	 	<div class="title">
	 		<h3>사용법</h3>
	 	</div>
	 	<div class="img">
	 		<div>
	 			<div id="img1"></div>
	 			<div>·프로젝트 중 하나를 선택하고 누를시 그동안 작성한 내용이 메모장으로 다운됩니다.</div>
	 		</div>
	 		<div>
	 			<div id="img2"></div>
	 			<div>·프로젝트를 생성합니다.</div>
	 		</div >
	 		<div>
	 			<div id="img3"></div>
	 			<div>·생성된 프로젝트입니다. 더블클릭시 워드타이핑이 가능한 페이지로 이동합니다.</div>
	 		</div>
	 		<div>
	 			<div id="img4"></div>
	 			<div>·생성된 프로젝트를 삭제합니다.</div>
	 		</div>
	 	</div>
		
	</div>	
</body>
</html>
