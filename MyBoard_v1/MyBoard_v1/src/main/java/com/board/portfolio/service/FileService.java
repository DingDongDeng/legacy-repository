package com.board.portfolio.service;

import com.board.portfolio.domain.dto.BoardDTO;
import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.BoardDetail;
import com.board.portfolio.domain.entity.FileAttachment;
import com.board.portfolio.exception.custom.FailDownLoadFileException;
import com.board.portfolio.exception.custom.FailSaveFileException;
import com.board.portfolio.repository.FileAttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RequiredArgsConstructor
@Component
public class FileService {

    private final FileAttachmentRepository fileAttachmentRepository;

    @Value("${file.save-path.attachment}")
    private String ATTACHMENT_FILE_PATH;
    @Value("${file.save-path.img}")
    private String IMG_FILE_PATH;
    @Value("${file.req-path.img}")
    private String REQ_PATH;

    public String Base64ToImg(String base64,String extension){
        String name = UUID.randomUUID().toString();
        byte[] imageBytes = Base64.getDecoder().decode(base64.trim());

        try {
            BufferedImage bufImg = ImageIO.read(new ByteArrayInputStream(imageBytes));
            ImageIO.write(bufImg, extension, new File(IMG_FILE_PATH+name+"."+extension));
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return REQ_PATH+name+"."+extension;
    }
    public void updateStoreImgFolder(String content, String dtoContent){
        List<String> transContents =  transContentToImgSrc(content);
        List<String> transContentDtos = transContentToImgSrc(dtoContent);

        for(String transContent : transContents){
            boolean isContain = transContentDtos.contains(transContent);
            if(!isContain){
                String[] parts = transContent.split("/");
                String fileName = parts[parts.length-1];
                deleteStoreImgFilePhysic(fileName);
            }
        }

    }
    public List<String> transContentToImgSrc(String content){
        String[] parts = content.split("<img .*?src\\s*=\\s*\"");
        List<String> result = new ArrayList();
        for(String part : parts){
            if(part.indexOf(REQ_PATH)==0){
                result.add(part.split("\".*>")[0]);
            }
        }
        return result;
    }
    public String transImgSrc(String content){
        String[] parts = content.split("data:image/");

        for(String part : parts){
            if(hasImgTag(part)){
                String[] data = part.split(";");
                String extension = data[0];
                String filePath = Base64ToImg(data[1].split(",")[1].split("\"")[0],extension);
                content = content.replaceFirst("data:image/"+extension+";base64.*?\"",filePath+"\"");
            }
        }
        return content;
    }

    private boolean hasImgTag(String content){
        boolean state = false;
        if(content.split(";").length>1){
            state = content.split(";")[1].indexOf("base64")==0;
        }
        return state;
    }

    public void saveFileAttachment(BoardDetail board, List<MultipartFile> multipartFileList, Account account) throws IOException {
        for(MultipartFile file : multipartFileList){
            String originName = file.getOriginalFilename();
            String extension = Arrays.stream(originName.split("\\.")).reduce((x, y)->y).get().toLowerCase();
            String saveName = UUID.randomUUID().toString()+"."+extension;

            byte[] bytes = file.getBytes();
            Path path = Paths.get(ATTACHMENT_FILE_PATH + saveName);
            Files.write(path, bytes);

            FileAttachment fileAttachment = FileAttachment.builder()
                    .board(board)
                    .originName(originName)
                    .saveName(saveName)
                    .extension(extension)
                    .account(account)
                    .build();

            fileAttachmentRepository.save(fileAttachment);
        }
    }
    @Cacheable(value = "fileList", key = "#boardId")
    public List<FileAttachment> getFileAttachment(long boardId, BoardDetail boardDetail){
        List fileList = boardDetail.getFileAttachmentList();
        return fileList;
    }

    public void download(HttpServletResponse res, FileAttachment file){
        setDownloadHeader(res,file);
        executeDownload(res,file);
    }
    private void setDownloadHeader(HttpServletResponse res, FileAttachment file){
        try{
            String docName = URLEncoder.encode(file.getOriginName(),"UTF-8").replaceAll("\\+", "%20"); //한글파일명 깨지지 않도록
            res.setContentType("application/octet-stream");
            res.setHeader("Content-Disposition",
                    "attachment;filename="+docName+";");
        }
        catch (IOException e){
            throw new FailDownLoadFileException();
        }
    }

    private void executeDownload(HttpServletResponse res, FileAttachment file){
        File down_file = new File(ATTACHMENT_FILE_PATH+file.getSaveName());
        try(FileInputStream fileIn = new FileInputStream(down_file);
            ServletOutputStream out = res.getOutputStream();){
            byte[] outputByte = new byte[4096];
            while(fileIn.read(outputByte, 0, 4096) != -1)
            {
                out.write(outputByte, 0, 4096);
            }
            out.flush();
            file.increaseDown();
        }
        catch (IOException e){
            throw new FailDownLoadFileException();
        }

    }
    public void deleteStoreImgFilePhysic(String fileName){

        File file = new File(IMG_FILE_PATH+fileName);
        if(file.exists())
            file.delete();

    }

    public void deleteStoreAttachFilePhysic(List<FileAttachment> fileAttachmentList){
        for(FileAttachment fileAttachment : fileAttachmentList){
            File file = new File(ATTACHMENT_FILE_PATH+fileAttachment.getSaveName());
            if(file.exists())
                file.delete();
        }
    }

    @CacheEvict(value = "fileList",key = "#boardId")
    public void updateFileList(List<FileAttachment> fileAttachmentList, BoardDTO.Update dto, long boardId, Account account ){
        if(fileAttachmentList==null){
            return;
        }
        for(FileAttachment file : fileAttachmentList){
            if(!dto.isExistFileId(file.getFileId())){
                deleteStoreAttachFilePhysic(Arrays.asList(file));
                fileAttachmentRepository.delete(file);
            }
        }

        try {
            if(!dto.isNullFileList()){
                saveFileAttachment(new BoardDetail(boardId), dto.getInputFileList(), account);
            }
        }
        catch (IOException e){
            throw new FailSaveFileException();
        }
    }
}
