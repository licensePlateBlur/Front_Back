package cbnu.software.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private String resourcePath ="file:///C:/Users/82103/Desktop/blindupload/";

    private String uploadPath="/images/**";

    //upload/** 요청이 올때 ** 부분이
    //로컬경로의 C:/resource/**로 요청이 전달됩니다.

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry)
    {
        registry.addResourceHandler(uploadPath).addResourceLocations(resourcePath);
    }
}
