package com.board.portfolio.validation.validator.constraint;

import com.board.portfolio.validation.anotation.FileExtension;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class FileExtensionValidator implements ConstraintValidator<FileExtension, List<MultipartFile>> {

    private String[] extensionArray;
    private boolean nullable;

    @Override
    public void initialize(FileExtension fileExtension) {
        this.extensionArray = fileExtension.fileExtension();
        for(int i=0 ;i<this.extensionArray.length; i++){
            extensionArray[i] = extensionArray[i].toLowerCase();
        }
        this.nullable = fileExtension.nullable();
    }
    @Override
    public boolean isValid(List<MultipartFile> fileList, ConstraintValidatorContext cxt) {
        if(nullable==false && isNull(fileList)){
            setValidatorDefaultMessageFormat("파일을 입력해주세요!",cxt);
            return false;
        }
        if(nullable==true && isNull(fileList)){
            return true;
        }
        boolean state = true;
        for(MultipartFile file : fileList){
            String fileName = file.getOriginalFilename().toLowerCase();
            if(!hasExtension(fileName)){
                state = false;
            }
            if(!isValidExtension(getExtension(fileName))){
                state = false;
            }
        }

        return state;
    }

    private String getExtension(String fileName){
        return fileName.split("\\.")[1];
    }

    private boolean hasExtension(String fileName){
        int size = fileName.split("\\.").length;
        if(size != 2)
            return false;
        return true;
    }
    private boolean isNull(Object obj){
        return !Optional.ofNullable(obj).isPresent();
    }

    private boolean isValidExtension(String extension){
        for(String ext : extensionArray){
            if(extension.equals(ext))
                return true;
        }
        return false;
    }

    private void setValidatorDefaultMessageFormat(String msg, ConstraintValidatorContext cxt){
        cxt.disableDefaultConstraintViolation();
        cxt.buildConstraintViolationWithTemplate(
                MessageFormat.format(msg,""))
                .addConstraintViolation();
    }
}