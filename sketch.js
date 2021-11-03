//Initialize grid setup
let nRows = 25;
let nCols = 25;
let path;
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
  path = "";
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

/*
Returns an array that contains the index of a valid grid spot, its xy
coordinates and the name of the direction that spot is in. 
The parameter 'currentIndex' is the index of the spot whose options need to
be analyzed.
The parameter 'currentPath' is a version of the path that is being looked at
in order to check for possible terminal strings. This can be the 
complete path (if the movement is not a failure) or a sub-path in the 
case where the path needs to find an altenate route.
*/
function searchOptions(currentIndex, currentPath)
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
              //Direction is valid
              let y = floor(newIndex/nRows);
              let x = newIndex % nCols;
              let dir;
              switch(newIndex)
              {
                case up:
                  dir = "u";
                  break;
                case dw:
                  dir = "d";
                  break;
                case right:
                  dir = "r";
                  break;
                case left:
                  dir = "l";
                  break;
                default:
                  dir = "none";
                  return [-1, -1, -1, "none"];
              }
              if(isTerminalString(currentPath, dir)) continue;
              return [newIndex, y, x, dir];
            }           
        }

    }
  //Terminal case -- stuck
  return [-1, -1, -1, "none"];
}

/*
  Checks whether an added movement to the path would result in
  an already-known failure.
*/
function isTerminalString(currentPath, dir)
{
  for(let i = 0; i < terminalstr.length; i++)
  {
    if(currentPath.concat("", dir) == terminalstr[i])
      return true;
  }
  return false;
}

function draw() 
{
  frameRate(10);
  
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
  /*
    Fetch retrieves a valid direction to move into.
    If the walk is stuck, the values in fetch will be -1.
  */
  let fetch = searchOptions(index, path);
  let dir = fetch[3];
  if(dir == "none")
  {
    console.log("I'm stuck!");
    fetch = pathfinder(path.slice(0, pathLength-2), path.charAt(pathLength-2), index, 0);
    //noLoop();
  }
  else
  {
    let prev_y = 2*yOffset*gridY + yOffset;
    let prev_x = 2*xOffset*gridX + xOffset;
    index = fetch[0];
    gridY = fetch[1];
    gridX = fetch[2];
    
    let y = 2*yOffset*gridY + yOffset;
    let x = 2*xOffset*gridX + xOffset;

    grid[index] = false;
    pathLength++;
    path = path.concat("", dir);
    console.log(path); //Test console log
    strokeWeight(lineCons);
    line(prev_x, prev_y, x, y);
    strokeWeight(pointCons);
    point(x, y);
  }
  
}