---
slug: agenda
title: Agenda
---
<main class="agenda-page">
<section class="page-content" aria-labelledby="agenda-title">
<div class="agenda-list" id="eventos-proximos">
<!-- Instituição dos Ministérios de Leitor e Acólito -->
<div class="agenda-item" data-fim="2026-10-05">
<div class="agenda-date">
<time datetime="2026-10-05">
5 de Outubro de 2026
</time>
</div>
<div class="agenda-content">
<img
src="/img/instituicao_leitor_acolito_lgpinto.png"
alt=""
>
<h4>Instituição dos Ministérios de Leitor e Acólito</h4>
<p>
Será instituído nos ministérios de leitor e acólito
Luís António Galego Pinto (Irmão Tomás Aurélio, TOP),
na Capela das Almas, Lourosa, pelas 11:00.
</p>
</div>
</div>
<!-- Fundação da Associação -->
<div class="agenda-item" data-fim="2026-10-14">
<div class="agenda-date">
<time datetime="2026-10-14">
14 de Outubro de 2026
</time>
</div>
<div class="agenda-content">
<img
src="/img/entre-caminhos-fundacao.png"
alt=""
>
<h4>Fundação da Associação</h4>
<p>
Celebração da fundação da
<a href="/associacao.html">Associação Entre Caminhos</a>.
</p>
</div>
</div>
<!-- Fundação da Comunidade -->
<div class="agenda-item" data-fim="2026-11-20">
<div class="agenda-date">
<time datetime="2026-11-20">
20 de Novembro de 2026
</time>
</div>
<div class="agenda-content">
<img
src="/img/comunidade-fundacao.png"
alt=""
>
<h4>Fundação da Comunidade</h4>
<p>
Celebração da data da fundação da Comunidade
da Capela das Almas.
</p>
</div>
</div>
<!-- Ordenação Diaconal -->
<div class="agenda-item" data-fim="2026-11-22">
<div class="agenda-date">
<time datetime="2026-11-22">
22 de Novembro de 2026
</time>
</div>
<div class="agenda-content">
<img
src="/img/luis_galego_pinto_diacono_22nov2026.png"
alt=""
>
<h4>Ordenação Diaconal</h4>
<p>
Será ordenado ao grau de diácono Luís António
Galego Pinto (Irmão Tomás Aurélio, TOP), na Capela
das Almas, Lourosa, pelas 10:00.
</p>
</div>
</div>
<!--
Peregrinação Anual a Fátima.
Sem dia definido, mantém-se na agenda
até ao final de dezembro.
-->
<div class="agenda-item" data-fim="2026-12-31">
<div class="agenda-date">
<time datetime="2026-12">
Dezembro de 2026
</time>
</div>
<div class="agenda-content">
<img
src="/img/peregrinacao.png"
alt=""
>
<h4>Peregrinação Anual a Fátima</h4>
<p>
A grande peregrinação anual de inverno, unindo todas
as frentes pastorais e fiéis num ato solene de
consagração e oração.
</p>
</div>
</div>
<!-- Festas: a data de fim corresponde ao último dia -->
<div class="agenda-item" data-fim="2027-05-30">
<div class="agenda-date">
<time datetime="2027-05-28">28</time>–<time
datetime="2027-05-30"
>30 Maio 2027</time>
</div>
<div class="agenda-content">
<img
src="/img/festa_ns_boa_viagem.png"
alt=""
>
<h4>
Festas em Honra de Nossa Senhora da Boa Viagem
e Nossa Senhora de Fátima
</h4>
<h4 class="agenda-subtitle">Programa</h4>
<ul>
<li>Procissão de Velas</li>
<li>Procissão Solene</li>
<li>Música ao vivo com artista a designar da TV</li>
<li>Grupo de Baile</li>
<li>Duos Musicais</li>
<li>Fogo de Artifício</li>
<li>Fanfarra</li>
<li>Banda de Música</li>
<li>Bênção dos Coletes</li>
<li>Entre outras atividades</li>
</ul>
<h4 class="agenda-subtitle">Convite</h4>
<p>
<strong>
Vamos todos ajudar a realizar estas festividades!
</strong>
<br>
<strong>
Contamos com a colaboração e participação de todos
para tornar estas festas um grande sucesso!
</strong>
</p>
</div>
</div>
</div>
<p class="agenda-vazia" id="agenda-vazia" hidden>
De momento, não existem eventos agendados.
</p>
<!-- A secção começa fechada por não ter o atributo "open". -->
<details class="agenda-arquivo" id="arquivo-eventos" hidden>
<summary>
Eventos passados
<span id="total-eventos-passados"></span>
</summary>
<div class="agenda-list" id="eventos-passados"></div>
</details>
<noscript>
<p>
Ative o JavaScript para separar automaticamente
os eventos passados dos próximos eventos.
</p>
</noscript>
</section>
<script>
(() => {
'use strict';
const proximos = document.getElementById('eventos-proximos');
const passados = document.getElementById('eventos-passados');
const arquivo = document.getElementById('arquivo-eventos');
const total = document.getElementById('total-eventos-passados');
const mensagem = document.getElementById('agenda-vazia');
// Obtém a data atual em Portugal no formato AAAA-MM-DD.
const partes = new Intl.DateTimeFormat('pt-PT', {
timeZone: 'Europe/Lisbon',
year: 'numeric',
month: '2-digit',
day: '2-digit'
}).formatToParts(new Date());
const obter = tipo =>
partes.find(parte => parte.type === tipo).value;
const hoje =
`${obter('year')}-${obter('month')}-${obter('day')}`;
// Mantém cada evento na agenda durante todo o seu último dia.
const eventosPassados = Array.from(
proximos.querySelectorAll('.agenda-item[data-fim]')
)
.filter(evento => evento.dataset.fim < hoje)
.sort((a, b) =>
b.dataset.fim.localeCompare(a.dataset.fim)
);
// Move os eventos passados para o arquivo,
// apresentando primeiro os mais recentes.
eventosPassados.forEach(evento => {
passados.appendChild(evento);
});
// Atualiza a contagem e a visibilidade do arquivo.
total.textContent = `(${eventosPassados.length})`;
arquivo.hidden = eventosPassados.length === 0;
// Mostra a mensagem se não restarem eventos na agenda principal.
mensagem.hidden =
proximos.querySelector('.agenda-item') !== null;
})();
</script>
