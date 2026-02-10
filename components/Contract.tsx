
import React from 'react';
import { ProposalFormData } from '../types';
import { formatCurrency, numberToWords, generateInstallmentDates } from '../utils/formatters';

interface ContractProps {
  data: ProposalFormData;
  amount: number;
  installments: number;
  submissionDate: string;
}

const Contract: React.FC<ContractProps> = ({ data, amount, installments, submissionDate }) => {
  const totalAmount = amount + (amount * 0.20 * installments);
  const installmentValue = totalAmount / installments;
  const subDate = new Date(submissionDate);
  
  const installmentDates = generateInstallmentDates(subDate, installments);
  const formattedSubmissionDate = subDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white p-10 md:p-20 shadow-xl border border-gray-100 max-w-4xl mx-auto font-serif text-slate-900 leading-relaxed text-[13px] print:shadow-none print:border-none print:p-0">
      <div className="text-center mb-12">
        <h1 className="text-lg font-bold uppercase underline decoration-1 underline-offset-4">INSTRUMENTO PARTICULAR DE CONFISSÃO DE DÍVIDA E TERMO DE ACORDO</h1>
      </div>

      <div className="space-y-6 text-justify">
        <section>
          <p>São partes neste instrumento:</p>
          <p className="mt-4">
            a) de um lado, na qualidade de <strong>CREDOR</strong>, <strong>KENNETH DEUBER ALMEIDA DE AMORIM</strong>, brasileiro, advogado, regularmente inscrito na OAB/AL sob nº 18.523 e CPF 045.556.404-38, com escritório profissional situado na Avenida Dom Antônio Brandão, Edf. Empresarial 203 Offices, 203, sala 405, Maceió – Alagoas, doravante denominado simplesmente CREDOR.
          </p>
          <p className="mt-4">
            b) de outro lado, na qualidade de <strong>DEVEDOR(A)</strong>, <strong>{data.nome || '<<NOME COMPLETO>>'}</strong>, nacionalidade: <strong>{data.nacionalidade || '<<NACIONALIDADE>>'}</strong>, estado civil: <strong>{data.estadoCivil || '<<ESTADO CIVIL>>'}</strong>, profissão: <strong>{data.profissao || '<<PROFISSÃO>>'}</strong>, RG nº <strong>{data.rg || '<<RG>>'}</strong> - <strong>{data.orgaoEmissor || '<<ÓRGÃO>>'}</strong>, inscrito(a) no CPF sob nº <strong>{data.cpf || '<<CPF>>'}</strong>, residente e domiciliado(a) no endereço: <strong>{data.rua || '<<RUA>>'}</strong>, nº <strong>{data.numero || '<<Nº>>'}</strong>, {data.complemento && `compl: ${data.complemento},`} bairro: <strong>{data.bairro || '<<BAIRRO>>'}</strong>, <strong>{data.cidade || '<<CIDADE>>'}</strong> / <strong>{data.estado || '<<UF>>'}</strong>, CEP nº <strong>{data.cep || '<<CEP>>'}</strong>.
          </p>
        </section>

        <p>
          As partes acima qualificadas, juridicamente capazes e abaixo assinadas pactuam entre si, justo e acordado, o presente Instrumento Particular de Confissão de Dívida e Termo de Acordo que se regerá pelas seguintes cláusulas:
        </p>

        <section>
          <p><strong>CLÁUSULA PRIMEIRA:</strong> O(s) DEVEDOR(es) acima qualificado(s), nesta data confessa(m) e declara(m) dever ao CREDOR, a importância líquida e certa de <strong>{formatCurrency(totalAmount)} ({numberToWords(totalAmount)})</strong>.</p>
        </section>

        <section>
          <p><strong>CLÁUSULA SEGUNDA:</strong> A importância descrita na Cláusula 1ª é originária de intermediação e fomento mercantil (microcrédito).</p>
        </section>

        <section>
          <p><strong>CLÁUSULA TERCEIRA:</strong> O(s) DEVEDOR(es) compromete(m)-se a pagar o débito no valor total de <strong>{formatCurrency(totalAmount)} ({numberToWords(totalAmount)})</strong>, em <strong>{installments} ({numberToWords(installments).replace(' reais', '')}) parcelas</strong> mensais e sucessivas de <strong>{formatCurrency(installmentValue)} ({numberToWords(installmentValue)})</strong>.</p>
          <p className="mt-4 font-bold underline">Cronograma de Vencimentos:</p>
          <ul className="mt-2 list-none pl-4 space-y-1">
            {installmentDates.map((date, idx) => (
              <li key={idx} className="font-mono text-xs">Parcela {idx + 1} — Vencimento: {date}</li>
            ))}
          </ul>
        </section>

        <section>
          <p><strong>CLÁUSULA QUARTA:</strong> As parcelas pactuadas na Cláusula 3ª deverão ser pagas por meio de transferência PIX para a chave indicada pelo CREDOR ou via boleto bancário, servindo o comprovante de transação como quitação da respectiva parcela.</p>
        </section>

        <section>
          <p><strong>CLÁUSULA QUINTA:</strong> O não pagamento de quaisquer das parcelas previstas no presente instrumento nas datas aprazadas fará incidir sobre o débito multa de 15%, juros de 1% ao mês e atualização monetária. O atraso superior a 5 dias tornará imediatamente vencidas e exigíveis todas as parcelas vincendas.</p>
          <p className="mt-2"><strong>Parágrafo Único:</strong> Este documento constitui-se em <strong>TÍTULO EXECUTIVO EXTRAJUDICIAL</strong>, apto a embasar processo de execução em caso de inadimplência, com renúncia expressa do devedor a qualquer alegação de impenhorabilidade de bens.</p>
        </section>

        <section>
          <p><strong>CLÁUSULA SEXTA:</strong> O presente instrumento é celebrado em caráter irrevogável e irretratável, vinculando as partes e seus sucessores a qualquer título.</p>
        </section>

        <section>
          <p><strong>CLÁUSULA SÉTIMA:</strong> As partes elegem o foro da Comarca de Maceió/AL para dirimir quaisquer dúvidas oriundas deste contrato.</p>
        </section>

        <p className="mt-12 text-right italic">
          Maceió-AL, {formattedSubmissionDate}.
        </p>

        <div className="mt-24 space-y-20">
          <div className="text-center">
            <div className="w-80 h-[0.5px] bg-slate-900 mx-auto mb-2"></div>
            <p className="font-bold uppercase tracking-tight">{data.nome || '<<NOME DO DEVEDOR>>'}</p>
            <p className="text-[10px] text-slate-500">DEVEDOR - CPF: {data.cpf || '<<CPF>>'}</p>
          </div>

          <div className="text-center">
            <div className="w-80 h-[0.5px] bg-slate-900 mx-auto mb-2"></div>
            <p className="font-bold uppercase tracking-tight">KENNETH DEUBER ALMEIDA DE AMORIM</p>
            <p className="text-[10px] text-slate-500">CREDOR</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 text-[9px] text-slate-400 text-center uppercase tracking-widest print:hidden">
          Documento gerado eletronicamente via Plataforma Afactoring
        </div>
      </div>
    </div>
  );
};

export default Contract;
