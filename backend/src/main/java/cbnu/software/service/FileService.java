package cbnu.software.service;

import cbnu.software.Entity.FileEntity;
import cbnu.software.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor //생성자를 자동으로 생성해서 의존관계를 주입해줌?
public class FileService {


    private final FileRepository fileRepository;
    public FileEntity uploadfile(MultipartFile file) throws IOException {
            //원래 파일 이름 추출
            String originalFilename = file.getOriginalFilename();

            //파일이름으로 쓸 UUID 생성
            String uuid = UUID.randomUUID().toString();

            // 확장자 추출(ex : .png)
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            //파일 확장자 검사(수정 예정)
            switch (extension)
            {
                case "pdf":

                    break;
                case "ppt":

                    break;
                case "docx":

                    break;
                case "hwp":

                    break;
            }
            // uuid / 원래이름 / 확장자 결합
            String savedName = uuid + extension;

            // 파일을 불러올 때 사용할 파일 경로
            String savedPath = "C:\\Users\\82103\\Desktop\\blindupload\\" + savedName;

            //dto로 변경해야하는 작업이 남아있음
            FileEntity fileEntity = new FileEntity();
            fileEntity.setOriginalFileName(originalFilename);
            fileEntity.setStoredFileName(savedName);
            fileEntity.setFile_path(savedPath);
            fileEntity.setFile_size(file.getSize());
            fileEntity.setFile_type(extension);
            fileEntity.setCreatedDate(LocalDateTime.now());
//            fileEntity.setPost(post); 아마 유저가 추가되면 작입이 필요해질듯

            // 실제로 로컬에 uuid를 파일명으로 저장
            file.transferTo(new File(savedPath));

            //-> 여기서 python에 넘겨준후 값을 받아올동안 기다리고, 다시 받아오면 될듯? -> 이것도 컨트롤러에서 받아와야하나.. 흠

            // 데이터베이스에 파일 정보 저장
            FileEntity savedFile = fileRepository.save(fileEntity);
            return  savedFile;
    }
    public Resource downloadImage(Long id) throws MalformedURLException {
        FileEntity fileEntity = fileRepository.findById(id).get();
        return new UrlResource("file:" + fileEntity.getFile_path());
    }
    public FileEntity findById(Long id)
    {
        return fileRepository.findById(id).get();
    }

    public List<FileEntity> files() {
        return fileRepository.findAll();
    }
    //로컬파일삭제
    @Transactional(readOnly = false)
    public void filedelete(Long id) {
        FileEntity fileEntity = fileRepository.findById(id).get();
        File file = new File(fileEntity.getFile_path()); //경로 가져오기
        if(file.exists()) { // 파일이 존재하면
            file.delete(); // 파일 삭제
        }
        fileRepository.deleteById(id);
    }
    public FileEntity findbystoredfilename(String storedFileName)
    {
        return fileRepository.findByStoredFileName(storedFileName);
    }
}
