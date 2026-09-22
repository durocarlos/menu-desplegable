(() => {
  'use strict';
  const sidebar = document.querySelector('#aebc-menu');
  const hamburger = document.querySelector('.menu__hamburguer');
  const overlay = document.querySelector('.menu__overlay');
  const profile = document.querySelector('#profile-select');
  const nav = document.querySelector('.menu__links');
  const pageTitle = document.querySelector('#page-title');
  const pageDescription = document.querySelector('#page-description');
  const pageStatus = document.querySelector('#page-status');
  const crumb = document.querySelector('#crumb');
  const roleLabel = document.querySelector('#role-label');
  const content = document.querySelector('#contenido');
  const descriptions = {
    'Inicio': 'Vista inicial del perfil seleccionado. No hay datos, indicadores ni sesión real conectados.',
    'Estudiantes': 'Consulta prevista para estudiantes de cada oferta académica autorizada. No hay matrículas ni listados reales conectados.',
    'Expediente del caso': 'Expediente previsto para el caso autorizado, sus versiones y referencias. No se cargan documentos reales.',
    'Evidencias': 'La consulta y registro de evidencias requiere API, permisos por caso y bitácora. Esta pantalla no sube archivos.',
    'Rúbricas': 'Las rúbricas se mostrarán según asignatura y actividad autorizadas. No se calculan ni guardan calificaciones.',
    'Retroalimentación': 'La retroalimentación requiere identidad, permisos y registro trazable. Aquí no se envían evaluaciones.',
    'Reportes institucionales': 'Los reportes institucionales estarán restringidos al ámbito de cada administración. No se consultan datos reales.',
    'Solicitudes de registro': 'El administrador revisará solicitudes después de que cada docente verifique su correo. Aquí no se aprueban cuentas reales.',
    'Roles y permisos': 'La API deberá validar los permisos y su ámbito. Cambiar el perfil de esta maqueta no concede privilegios.',
    'Asignaciones académicas': 'Una misma identidad podrá tener varias asignaturas, cursos y paralelos. No se han cargado asignaciones reales.',
    'Correo académico': 'El correo de cada docente no está conectado; esta maqueta no envía mensajes.',
    'Reportes': 'Los reportes se alimentarán de consultas autorizadas de AEBC. No se muestran resultados ficticios.'
  };
  function closeMobile() {
    sidebar.classList.remove('menu__links--show');
    overlay.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú');
  }
  function collapseSubmenus() {
    nav.querySelectorAll('.menu__toggle').forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
      document.getElementById(toggle.getAttribute('aria-controls')).hidden = true;
    });
  }
  function setPage(button) {
    nav.querySelectorAll('[data-page]').forEach(link => { link.classList.remove('is-current'); link.removeAttribute('aria-current'); });
    button.classList.add('is-current');
    button.setAttribute('aria-current', 'page');
    const name = button.dataset.page;
    pageTitle.textContent = crumb.textContent = name;
    pageDescription.textContent = descriptions[name] || `Área «${name}»: vista de navegación pendiente de conexión con la API AEBC.`;
    pageStatus.textContent = 'Esta pantalla no consulta datos ni ejecuta operaciones académicas. Su disponibilidad real dependerá de una sesión y permisos validados por el backend.';
    closeMobile();
    content.focus({ preventScroll: true });
  }
  nav.addEventListener('click', event => {
    const toggle = event.target.closest('.menu__toggle');
    if (toggle && nav.contains(toggle)) {
      const submenu = document.getElementById(toggle.getAttribute('aria-controls'));
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      submenu.hidden = expanded;
      return;
    }
    const page = event.target.closest('[data-page]');
    if (page && nav.contains(page)) setPage(page);
  });
  profile.addEventListener('change', () => {
    const role = profile.value;
    const combined = role === 'combinado';
    nav.querySelectorAll('.menu__group').forEach(group => {
      group.hidden = !combined && group.dataset.profile !== role;
    });
    // Una sola entrada Inicio; no se duplican identidad ni navegación.
    nav.querySelector('.menu__group[data-profile="administrador"] [data-page="Inicio"]').hidden = combined;
    roleLabel.textContent = combined ? 'VISTA DOCENTE + ADMINISTRADOR' :
      role === 'docente' ? 'VISTA DOCENTE' : 'VISTA ADMINISTRATIVA';
    collapseSubmenus();
    const homeRole = combined ? 'docente' : role;
    const home = nav.querySelector(`.menu__group[data-profile="${homeRole}"] [data-page="Inicio"]`);
    setPage(home);
  });
  hamburger.addEventListener('click', () => {
    const opening = !sidebar.classList.contains('menu__links--show');
    sidebar.classList.toggle('menu__links--show', opening);
    overlay.hidden = !opening;
    hamburger.setAttribute('aria-expanded', String(opening));
    hamburger.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
  });
  overlay.addEventListener('click', closeMobile);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMobile(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 850) closeMobile(); });
})();
