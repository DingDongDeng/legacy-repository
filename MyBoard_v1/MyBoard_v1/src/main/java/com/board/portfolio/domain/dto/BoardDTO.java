package com.board.portfolio.domain.dto;

import com.board.portfolio.validation.anotation.BoardIdExist;
import com.board.portfolio.validation.anotation.FileExtension;
import com.board.portfolio.validation.anotation.FileSize;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;


public class BoardDTO {
    @Data
    public static class Search{
        private boolean title;
        private boolean content;
        private boolean nickname;
        @NotBlank(message = "{board.search.blank}")
        private String keyword;
    }

    @Data
    public static class Write{
        @NotBlank(message = "{board.title.not.blank}")
        @Size(min=1,max=50,message = "{board.title.size}")
        private String title;
        @NotBlank(message = "{board.content.not.blank}")
        private String content;
        @FileSize(fileSize = 5*1024*1024, nullable = true, message = "{board.filesize}")
        @FileExtension(fileExtension = {"txt","hwp",
                                        "pdf","doc","docx","ppt","pptx","xls","xlsx",  //office 문서 확장자
                                        "png","jpg","jpeg","gif", //이미지 확장자
                                        "zip"},
                        nullable = true, message = "{board.fileextension}")
        private List<MultipartFile> fileList;

        public boolean isNullFileList(){
            return fileList==null;
        }
    }
    @Data
    public static class Update{
        @NotBlank(message = "{board.title.not.blank}")
        @Size(min=1,max=50,message = "{board.title.size}")
        private String title;
        @NotBlank(message = "{board.content.not.blank}")
        private String content;

        @Valid
        private List<FileDTO> existFileInfoList;

        @FileSize(fileSize = 5*1024*1024, nullable = true, message = "{board.filesize}")
        @FileExtension(fileExtension = {"txt","hwp",
                "pdf","doc","docx","ppt","pptx","xls","xlsx",  //office 문서 확장자
                "png","jpg","jpeg","gif", //이미지 확장자
                "zip"},
                nullable = true, message = "{board.fileextension}")
        private List<MultipartFile> inputFileList;

        public boolean isNullFileList(){
            return inputFileList==null;
        }
        public boolean isExistFileId(String fileId){
            if(existFileInfoList==null){
                return false;
            }

            for(FileDTO dto : existFileInfoList){
                if(dto.getFileId().equals(fileId)){
                    return true;
                }
            }
            return false;
        }
    }

    @Data
    public static class Like{
        @NotNull
        @BoardIdExist(message = "{board.exist}")
        private Long boardId;
    }
}
