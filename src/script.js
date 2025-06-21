import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { format } from 'https://cdn.skypack.dev/date-fns';

const supabase = createClient(
  'https://zkzrfvkwyhpfwejqyawk.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprenJmdmt3eWhwZndlanF5YXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTM5MzcsImV4cCI6MjA2MzkyOTkzN30.ZFIdFddIXtkhfJDeTeOfj888rQzJJIiLKNjCaHz6O-E'
);

let sort = 'created_at.desc';

async function fetchArticles() {
  const [field, dir] = sort.split('.');
  const { data, error } = await supabase
    .from('article')
    .select('*')
    .order(field, { ascending: dir === 'asc' });

  if (error) {
    console.error(error);
    return;
  }

  const list = document.getElementById('articles');
  list.innerHTML = '';
  data.forEach(article => {
    const item = document.createElement('div');
    item.innerHTML = `
      <h3>${article.title}</h3>
      <h4>${article.subtitle}</h4>
      <p><strong>${article.author}</strong> | ${format(new Date(article.created_at), 'dd-MM-yyyy')}</p>
      <p>${article.content}</p>
      <hr />
    `;
    list.appendChild(item);
  });
}

fetchArticles();

document.getElementById('sort').addEventListener('change', (e) => {
  sort = e.target.value;
  fetchArticles();
});

document.getElementById('article-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const article = {
    title: form.title.value,
    subtitle: form.subtitle.value,
    author: form.author.value,
    content: form.content.value,
    created_at: form.created_at.value
      ? new Date(form.created_at.value).toISOString()
      : new Date().toISOString()
  };

  const { error } = await supabase.from('article').insert([article]);

  if (error) {
    alert('Błąd!');
    console.error("Błąd Supabase:", error.message, error.details);
  } else {
    alert('Dodano!');
    form.reset();
    fetchArticles();
  }
});