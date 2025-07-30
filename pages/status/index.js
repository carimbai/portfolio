import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Última Atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatusInfo = "Carregando...";

  if (!isLoading && data) {
    databaseStatusInfo = (
      <>
        <div>
          Versão do Banco de Dados: {data.dependencies.database.version}
        </div>
        <div>
          Número Máximo de Conexões:{" "}
          {data.dependencies.database.max_connections}
        </div>
        <div>
          Número de Conexões Abertas:{" "}
          {data.dependencies.database.opened_connections}
        </div>
      </>
    );
  }
  return (
    <>
      <h2>Database</h2>
      <div>{databaseStatusInfo}</div>
    </>
  );
}
