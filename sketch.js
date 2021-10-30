//Initialize grid setup
let nRows = 25;
let nCols = 25;
let pathLength;
let gridFull = pathLength == nRows* nCols;
let totalWidth = window.innerWidth;
let totalHeight = window.innerHeight;
let pointCons = 10;
let lineCons = 5;
function setup() 
{
  let canvas = createCanvas(totalWidth, totalHeight);
  background(000);
  grid = setupGrid(nRows, nCols);
  pathLength = 0;
}
function setupGrid(r, c)
{
  newGrid = [];
  for(let x = 0; x < r*c; x++)
    {
      //A spot is true if it's available.
      newGrid[x] = true 
    }
  //The row of a spot can be calculated using a mod operation
  //Ex: In a 5x5 grid, spot no. 8 is in col 8%5 = 3, row floor(8/5)
  return newGrid;
}
//Coordinates
let index;
let gridX;
let gridY;

function isAdjacent(newIndex)
{
  if(index%nCols > 0 && index%nCols < nCols-1)
    return true;
  else if(index%nCols == 0 && newIndex == index - 1)
    return false;
  else if(index%nCols == nCols - 1 && newIndex == index + 1)
    return false;
  return true;
}

function findPermutations(A)
{
  let ret = [];

  for (let i = 0; i < A.length; i = i + 1) {
    let rest = findPermutations(A.slice(0, i).concat(A.slice(i + 1)));

    if(!rest.length) {
      ret.push([A[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([A[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

function searchOptions()
{
  //Search indices of neighbours, then get the grid coordinates
  let up = index - nCols;
  let dw = index + nCols;
  let right = index + 1;
  let left = index - 1;
  let searchArr =[up, dw, right, left];
  //Permutate the search array and pick a permutation randomly
  let permutations = findPermutations(searchArr);
  //console.log(permutations);
  permIndex = floor(random(permutations.length));
  searchArr = permutations[permIndex];
  console.log(searchArr);
  for(let i = 0; i < searchArr.length; i++)
    {
      let newIndex = searchArr[i];
      //console.log(newIndex)
      if(newIndex >= 0 && newIndex < grid.length)
        {
          if(grid[newIndex] == true)
            {
              if(!isAdjacent(newIndex)) continue;
              let y = floor(newIndex/nRows);
              let x = newIndex % nCols;
              return [newIndex, y, x];
            }           
        }

    }
  //Terminal case -- stuck
  return [-1, -1, -1];
}
function draw() 
{
  frameRate(1);
  
  strokeWeight(pointCons);
  stroke('white');
  //Separation constants
  let xOffset = width/(nCols*2); 
  let yOffset = height/(nRows*2);
  
  if(gridFull)
    {
      noLoop();
      let resultMessage = createP('');
      resultMessage.style('font-size', '32pt');
      resultMessage.html('Path found!');
    }
  //Start path from a random spot
  if(pathLength == 0)
    {
      index = floor(random(grid.length+ 1));
      gridY = floor(index/nRows);
      gridX = index % nCols;
      grid[index] = false;     
      point(2*xOffset*gridX+xOffset, 2*yOffset*gridY + yOffset);
      pathLength = 1;
    }
  console.log('Current position: ' + index + '\tPath length: '+pathLength);
  let fetch = searchOptions();
  let prev_y = 2*yOffset*gridY + yOffset
  let prev_x = 2*xOffset*gridX+xOffset;
  index = fetch[0];
  gridY = fetch[1];
  gridX = fetch[2];
  let y = 2*yOffset*gridY + yOffset;
  let x = 2*xOffset*gridX+xOffset;
  if(index == -1 || gridY == -1 || gridX == -1)
    {
      console.log("I'm stuck!");
      noLoop();
    }
  else
    {
    grid[index] = false;
    strokeWeight(lineCons);
    line(prev_x, prev_y, x, y);
    strokeWeight(pointCons);
    point(x, y);
    pathLength++;
    }
}