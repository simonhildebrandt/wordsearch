import React, { useState, useCallback, useRef, useEffect } from 'react';

import styled from 'styled-components';

import { Flex, Text, SimpleGrid, AspectRatio } from '@chakra-ui/react';

import useOnEventOutside from './use-on-event-outside';


const reverseString = (string) => string.split("").reverse().join("");

const LetterText = styled.text`
  font-family: Roboto;
  font-weight: 400;
  font-size: 50px;
  text-anchor: middle;
  dominant-baseline: middle;
`

const Fill = styled.rect`
  fill: white;
  x: 0px;
  y: 0px;
  width: 100px;
  height: 100px;
`

const Rect = styled.rect`
  fill: none;
  stroke: #DDDDDD;
  stroke-width: 1px;
  x: 10px;
  y: 10px;
  width: 80px;
  height: 80px;
`

const Letter = styled.g`
  transform: ${({x, y}) => "translate(" + (x * 100) + "px, " + (y * 100) + "px)"};
  cursor: pointer;
  user-select: none;
`


export default function Wordsearch({wordsearch, cols, rows}) {

  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);

  const [foundWords, setFoundWords] = useState({});

  const svgRef = useRef();
  const handleOutsideEvent = useCallback(() => {
    setStartPosition(null);
    setEndPosition(null);
  })

  useOnEventOutside(svgRef, handleOutsideEvent, ["mouseup"]);

  const words = wordsearch.words.map(w => w.clean);
  let validSelection = false; //startPosition && endPosition &&
  let selectedWord = null;
  let backWord = false;

  if (startPosition && endPosition) {
    const playerWord = wordsearch.read(startPosition, endPosition);
    if (playerWord) {
      const reversedPlayerWord = reverseString(playerWord);
      if (words.includes(playerWord)) {
        validSelection = true;
        selectedWord = playerWord;
      }
      if (words.includes(reversedPlayerWord)) {
        validSelection = true;
        selectedWord = reversedPlayerWord;
        backWord = true;
      }
    }
  };

  useEffect(() => {
    function preventBehavior(e) {
        e.preventDefault();
    };

    document.addEventListener("touchmove", preventBehavior, {passive: false});
    return () => document.removeEventListener("touchmove", preventBehavior, {passive: false});

  }, []);

  function onPointerMove(x, y, e) {
    e.target.releasePointerCapture(e.pointerId);
    setEndPosition({x, y});
  }

  function onPointerUp() {
    setStartPosition(null);
    setEndPosition(null);
    if (selectedWord) {
      const start = !backWord ? startPosition : endPosition;
      const end = backWord ? startPosition : endPosition;
      setFoundWords({
        ...foundWords,
        [`${start.x}-${start.y}-${end.x}-${end.y}`]: {
          start, end, selectedWord
        }
      })
    };
  }

  function onPointerDown(x, y) {
    setStartPosition({x, y});
  }

  function wordFound(word){
    return Object.values(foundWords).map(f => f.selectedWord).some(w => w == word);
  }


  return <Flex direction="column">
    <AspectRatio maxW="100%" ratio={1}>
      <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${cols * 100} ${rows * 100}`}>
        { wordsearch.grid.map((rows, rowIndex) => (
          rows.map((letter, columnIndex) => (
            <Letter
              x={columnIndex}
              y={rowIndex}
              key={`${columnIndex}-${rowIndex}`}
              id={`${columnIndex}-${rowIndex}`}
              onPointerDown={e => onPointerDown(columnIndex, rowIndex, e)}
              onPointerMove={e => onPointerMove(columnIndex, rowIndex, e)}
              onPointerUp={onPointerUp}
            >
              <Fill/>
              <Rect/>
              <LetterText x="50px" y="55px">{letter}</LetterText>
            </Letter>
          ))
        )) }

        { Object.entries(foundWords).map(([key, {start, end}]) => (
          <line
            key={key}
            pointerEvents="none"
            stroke={"#0000DD44"}
            strokeWidth="80px"
            strokeLinecap="round"
            x1={start.x * 100 + 50}
            y1={start.y * 100 + 50}
            x2={end.x * 100 + 50}
            y2={end.y * 100 + 50}
          />
        )) }

        { startPosition && endPosition && (
          <line
            pointerEvents="none"
            stroke={validSelection ? "#00DD0044" : "#FF000044"}
            strokeWidth="80px"
            strokeLinecap="round"
            x1={startPosition.x * 100 + 50}
            y1={startPosition.y * 100 + 50}
            x2={endPosition.x * 100 + 50}
            y2={endPosition.y * 100 + 50}
            onPointerUp={onPointerUp}
          />
        ) }

      </svg>
    </AspectRatio>
    <SimpleGrid>
      { words.map(word => (
        <Text key={word} textDecoration={wordFound(word) && "line-through"}>{word}</Text>
      ))}
    </SimpleGrid>
  </Flex>
}
