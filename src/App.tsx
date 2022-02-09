import React, { useState, useEffect } from 'react';
import './App.css';
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookIcon,
  FacebookShareButton,
  WhatsappShareButton,
  WhatsappIcon
} from "react-share";
import TextField from '@mui/material/TextField'
import RadioButtonsGroup from './components/radio-buttons/radio-buttons'
import Box from '@mui/material/Box';
import { common } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

const theme = createTheme({
  palette: {
    primary: {
      main: common['black'],
    },
  },
});

const ansaRssList = [
  'https://www.ansa.it/sito/notizie/topnews/topnews_rss.xml',
  'https://www.ansa.it/sito/notizie/sport/sport_rss.xml',
  'https://www.ansa.it/sito/ansait_rss.xml',
  'https://www.ansa.it/sito/notizie/cultura/cultura_rss.xml',
  'https://www.ansa.it/sito/notizie/economia/economia_rss.xml',
  'https://www.ansa.it/english/english_rss.xml',
  'https://www.ansa.it/sito/notizie/cultura/cinema/cinema_rss.xml',
  'https://www.ansa.it/canale_motori/notizie/motori_rss.xml',
]

const itSentence = ', come italia veeva chiedeva da tempo!';
const englishSentence = ' as italia veeva has asked for a long time!';

const getRandomElementArray = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)]

const readQueryStringParams = () => {
  const params = new URLSearchParams(window.location.search)
  return {
    sentence: params.get('sentence'),
    prefix: params.get('prefix') === 'true' || false,
    hashtag: params.get('hashtag') || '',
  }
}


const getRss = async (rssUrl = getRandomElementArray(ansaRssList)) => {
  const urlRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/;
  if (!urlRegex.test(rssUrl)) {
    return;
  }
  const res = await fetch(`https://api.allorigins.win/get?url=${rssUrl}`);
  const { contents } = await res.json();
  const feed = new window.DOMParser().parseFromString(contents, "text/xml");
  const items = feed.querySelectorAll("item");
  //@ts-ignore
  return [...items].map((el) => ({
    textContent: el.querySelector("title").textContent,
    english: rssUrl.includes("english"),
    hashtags: [],
  })) || [];
};

function updateVisitCount() {
  fetch('https://api.countapi.xyz/update/italia-veeva/af25242b-2262-4bf6-b243-487d6e2da607/?amount=1')
    .then(res => res.json())
    .then(res => {
      const countEl = document.getElementById('count');
      //@ts-ignore
      countEl.innerHTML = res.value;
    })
}

const clearLink = (buildedLink: string) => {
  buildedLink = buildedLink.replace(`sentence=&`, '');
  buildedLink = buildedLink.replace(`hashtag=&`, '');
  buildedLink = buildedLink.replace(`&prefix=false`, '');
  buildedLink = buildedLink.replace(`?prefix=false`, '');
  return buildedLink;
}

const clearHrefAnchor = (link: string) => {
  return link.replace('#create-news', '')
}


function App() {
  const [rssData, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { sentence: queryStringSentece, prefix: querystringPrefix, hashtag: queryStringHashtag } = readQueryStringParams();
  const [textInput, setTextInput] = useState('')
  const [hashtagInput, setHashtagInput] = useState('')
  const [buttonsInput, setButtonsInput] = useState('false')
  let buildedLink = clearLink(`${window.location.origin + window.location.pathname}/?sentence=${textInput}&hashtag=${hashtagInput}&prefix=${buttonsInput}`);

  const onTextInputChange = (e: any) => {
    console.log('value:', e.target.value);
    setTextInput(e.target.value)
  }

  const onHashtagInputChange = (e: any) => {
    console.log('value:', e.target.value);
    setHashtagInput(e.target.value)
  }

  const buttonGroupHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setButtonsInput(event.target.value)
  };

  useEffect(() => {
    (
      async function () {
        try {
          setLoading(true)
          const response = await getRss();
          //@ts-ignore
          setData(response)
          updateVisitCount();
        }
        catch (er: any) {
          //@ts-ignore
          setError(err)
        } finally {
          setLoading(false)
        }
      }
    )()
  }, [])

  //@ts-ignore
  const newsObject = !loading && rssData.length ? getRandomElementArray(rssData) : null;
  const titleNews = newsObject ? newsObject.textContent : '';
  const defaultSentence = newsObject && newsObject.english ? englishSentence : itSentence;
  const sentence = queryStringSentece || defaultSentence;
  let newsSentence = querystringPrefix ? `${sentence}${titleNews}` : `${titleNews}${sentence}`;
  const shareUrl = clearHrefAnchor(window.location.href);
  const hashtags = ["simurgnews"];
  queryStringHashtag && hashtags.splice(0, 0, queryStringHashtag)
  const createYourNews = " - crea la tua news:"


  return (
    <div className="App">
      <header className="App-header">
        <p className='newsSentence'>{loading ? "Loading..." : newsSentence}</p>
        <div id="share-container" className='shareContainer' style={{ marginLeft: 10 }}>
          <TwitterShareButton title={newsSentence} hashtags={hashtags} url={shareUrl}><TwitterIcon className={"shareIcon"} /></TwitterShareButton>
          <FacebookShareButton title={newsSentence + createYourNews} url={shareUrl}><FacebookIcon className={"shareIcon"} /></FacebookShareButton>
          <WhatsappShareButton title={newsSentence + createYourNews} url={shareUrl}><WhatsappIcon className={"shareIcon"} /></WhatsappShareButton>
        </div>
        <div style={{ marginTop: 50 }}>
          <p className="otherNewsOutcome">Ricarica la pagina per altre fantastiche news</p>
          <div className="visits">
            <p>Questa pagina è stata visitata</p>
            <h1 id="count">-</h1>
            <p>volte</p>
          </div>
          <a href="#create-news" className='float-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" height="80" viewBox="0 0 54 54" width="80">
              <path fill="white" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path>
            </svg>
          </a>
        </div>
      </header>
      <ThemeProvider theme={theme}>
        <Box sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
          <div className="App-build-news" id="create-news">
            <h3>Crea la tua N💣tizia</h3>
            <TextField
              required
              onChange={onTextInputChange}
              label="Componi la frase"
              fullWidth
            />
            <RadioButtonsGroup handleChange={buttonGroupHandleChange} />
            <TextField
              label="Scegli un hastag (non è necessario usare il #)"
              fullWidth
              onChange={onHashtagInputChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
            <a href={buildedLink} target='_blank' rel="noreferrer">condividi ora il tuo nuovo link!</a>
          </div>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
