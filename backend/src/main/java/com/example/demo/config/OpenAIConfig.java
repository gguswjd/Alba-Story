package com.example.demo.config;

import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAIConfig {

    @Value("${openai.api.key:#{null}}")
    private String apiKey;

    @Bean
    public OpenAiService openAiService() {
        // API 키가 없으면 null 반환
        if (apiKey == null || apiKey.isEmpty()) {
            return null;
        }
        return new OpenAiService(apiKey);
    }
}
