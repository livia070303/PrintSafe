import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout title="Sobre o Projeto - PrintSafe">
      <main className="page-container">
        <h1>Sobre o Projeto PrintSafe</h1>
        <p className="subtitle">Monitoramento inteligente para qualidade em impressão 3D</p>

        <section className="card">
          <h2>📌 Sobre o Projeto</h2>
          <p>
            O <span className="highlight">PrintSafe</span> é um projeto desenvolvido
            para monitorar o ambiente de impressão 3D, garantindo que fatores
            críticos como temperatura, umidade e peso  do filamento estejam sempre dentro dos padrões ideais.
          </p>
          <p>
            A proposta do sistema é evitar falhas nas impressões, aumentar a
            durabilidade dos materiais e melhorar a qualidade final das peças
            produzidas. Com isso, o projeto contribui para um processo mais
            eficiente, seguro e automatizado.
          </p>
        </section>

        <section className="card">
          <h2>⚙️ Como Funciona</h2>
          <p>
            O PrintSafe utiliza sensores conectados a um microcontrolador que
            coleta dados ambientais em tempo real. Essas informações são enviadas
            para uma interface web, onde o usuário pode acompanhar gráficos,
            histórico e indicadores de qualidade.
          </p>
          <p>
            O sistema permite selecionar diferentes materiais, como PLA, PETG, ABS, NYLON e
            TPU, ajustando os parâmetros ideais para cada situação.
          </p>
        </section>

        <section className="card">
          <h2>🖨️ Estrutura do Projeto</h2>
          <div className="image-grid">
            <ImageCard title="Estufa" src="/impressora-3D.jpeg" alt="Impressora 3D" />
            {/* <ImageCard title="Sensores e Hardware" src="/prototipo.jpeg" alt="Sensores e componentes" />
            <ImageCard title="Peças Produzidas" src="/peca-impressa.jpeg" alt="Peças impressas" /> */}
          </div>
        </section>

        <section className="card">
          <h2>🎯 Objetivo</h2>
          <p>
            O objetivo do projeto é proporcionar maior controle sobre o ambiente
            de impressão, reduzindo erros, otimizando recursos e garantindo maior
            qualidade nas peças produzidas. O PrintSafe também serve como uma
            aplicação prática de conhecimentos em IoT, desenvolvimento web e
            análise de dados.
          </p>
        </section>

        <footer>© 2026 PrintSafe — Projeto de Engenharia da Computação</footer>
      </main>
    </Layout>
  );
}

function ImageCard({ title, src, alt }) {
  return (
    <div>
      <p><strong>{title}</strong></p>
      <div className="image-box">
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}