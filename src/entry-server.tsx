import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import {
  getServerSidePropsForRoute,
  generateMetaTagsForRoute,
  generateHeadContentForRoute
} from './utils/routeHelpers'

export async function render(url: string) {
  console.log('🖥️  Renderizando en el servidor para URL:', url)

  try {
    const routeData = await getServerSidePropsForRoute(url)

    const initialPageProps = {
      route: routeData.route,
      data: routeData.data,
      error: routeData.error
    }

    const html = renderToString(
      <StrictMode>
        <StaticRouter location={url}>
          <App initialPageProps={initialPageProps} />
        </StaticRouter>
      </StrictMode>,
    )

    const metaTags = generateMetaTagsForRoute(url, routeData.data)
    const headContent = generateHeadContentForRoute(url)

    console.log(`✅ Renderizado exitoso para ${url}`)
    console.log(`📊 Datos obtenidos:`, routeData.data ? 'Sí' : 'No')

    return {
      html,
      initialData: initialPageProps,
      meta: metaTags,
      head: headContent
    }
  } catch (error) {
    console.error('❌ Error durante el renderizado SSR:', error)

    const errorHtml = renderToString(
      <StrictMode>
        <StaticRouter location={url}>
          <div style={{
            padding: '40px',
            textAlign: 'center',
            background: 'rgba(244, 67, 54, 0.1)',
            border: '2px solid #f44336',
            borderRadius: '12px',
            margin: '20px'
          }}>
            <h1>⚠️ Error del Servidor</h1>
            <p>Ocurrió un error durante el renderizado de la página.</p>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#666' }}>
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
          </div>
        </StaticRouter>
      </StrictMode>
    )

    return {
      html: errorHtml,
      initialData: {
        route: url,
        data: null,
        error: error instanceof Error ? error.message : 'Error del servidor'
      },
      meta: `
        <title>Error del Servidor - SSR Demo App</title>
        <meta name="description" content="Ocurrió un error durante el renderizado" />
      `.trim(),
      head: ''
    }
  }
}
