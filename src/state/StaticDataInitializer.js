import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { useRecoilState } from 'recoil'

import {
  colorsAtom,
  mp3sAtom,
  wikiEntryTypesAtom,
} from './atoms/staticDataAtoms'

console.log('using preload')
// const callDatabase = window.callDatabase

const baseUrl = 'http://127.0.0.1:4204' // TODO: stick this in a .env file

const importMp3 = async (trackName) => {
  const { default: mp3 } = await import(`../assets/ambiences/${trackName}`);
  return mp3;
}

const importMp3s = async (trackNames) => {
  const mp3sAsArray = Promise.all(trackNames.map(async (trackName) => {

    return {
      name: trackName,
      track: await importMp3(trackName),
    }
  }))

  const mp3s = (await mp3sAsArray).reduce((aggr, mp3Entry) => {
    return {
      ...aggr,
      [mp3Entry.name]: mp3Entry.track,
    };
  }, {})

  return mp3s;
}

const StaticDataInitializer = (props) => {
  const [staticDataHasLoaded, setStaticDataHasLoaded] = useState(false)
  const [, setColors] = useRecoilState(colorsAtom)
  const [, setMp3s] = useRecoilState(mp3sAtom)
  const [, setWikiEntryTypes] = useRecoilState(wikiEntryTypesAtom)
  
  useEffect(() => {
    const getStaticData = async () => {     
      const { data: trackNames} = await axios.get(`${baseUrl}/api/trackNames`)
      const mp3s = await importMp3s(trackNames); 
      setMp3s(mp3s)

      const { 
        colors,
        wikiEntryTypes,
      } = await axios.get(`${baseUrl}/api/staticData`)
 
      setColors(colors)
      setWikiEntryTypes(wikiEntryTypes)

      setStaticDataHasLoaded(true)
    }

    getStaticData()
  }, [])

  return staticDataHasLoaded 
    ? <>{props.children}</>
    : null
}



export default StaticDataInitializer