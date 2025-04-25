# 🔋 Calculadora de Autonomia de Baterias

<!-- [![Netlify Status](https://api.netlify.com/api/v1/badges/{ID_DO_BADGE_NETLIFY}/deploy-status)](https://app.netlify.com/sites/{SEU_SITE_NETLIFY}/deploys) -->

Uma ferramenta web simples e prática para calcular a autonomia estimada de sistemas de baterias de **Lítio** e **Estacionárias (Chumbo-Ácido)**. Ideal para auxiliar no planejamento de sistemas de energia, veículos recreativos (motorhomes, trailers), barcos, nobreaks e diversos projetos DIY.

**Link da Calculadora Online:** *(Será adicionado após deploy)*

## ✨ Funcionalidades

*   **Interface Clara:** Página inicial para escolha do tipo de bateria.
*   **Calculadora Dedicada para Lítio:**
    *   Calcula baseado na capacidade nominal por bateria, quantidade em paralelo e consumo médio.
    *   Aplica um fator de **85% de capacidade útil** para uma estimativa mais realista e segura.
*   **Calculadora Dedicada para Estacionárias:**
    *   Focada em arranjos comuns de **48V** (strings de 4 baterias 12V em série).
    *   Assume uma capacidade padrão de **63Ah por string** (ajustável no código, se necessário).
    *   Considera uma profundidade de descarga (DoD) de **50%**, recomendada para maior vida útil de baterias chumbo-ácido.
    *   Requer a quantidade *total* de baterias 12V e o consumo médio do sistema.
*   **Resultado Detalhado:** Exibe capacidade nominal, capacidade útil considerada e o tempo de autonomia estimado em horas e minutos.
*   **Design Responsivo:** Adaptável a diferentes tamanhos de tela (desktop, tablet, mobile).
*   **Tema Moderno:** Interface com cores e gradientes inspirados em designs atuais.

## 🛠️ Tecnologias Utilizadas

*   HTML5
*   CSS3 (com Variáveis CSS e Flexbox)
*   JavaScript (Vanilla JS - ES6+)

## 🌐 Próximos Passos: Deploy

Após o deploy, o link para a versão online e o status do build serão adicionados a este README.

## 🤝 Contribuições

Contribuições são bem-vindas! Se encontrar algum problema ou tiver sugestões de melhoria, sinta-se à vontade para abrir uma **Issue** ou enviar um **Pull Request**.

## 📄 Licença

---
