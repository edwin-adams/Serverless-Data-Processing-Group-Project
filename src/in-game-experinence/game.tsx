import "./game.css";


const Game = () => {
  return (
    <>
      <div className="container">
        <div className="row mt-4 border rounded pb-3">
          <div className="col-md-12 mt-2">
            <p className="question">Q1. Some questions will be here</p>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <p className="answer m-0 ">A1. Some answers will be here</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card cursor-pointer" >
                <div className="card-body">
                  <p className="answer m-0 ">A1. Some answers will be here</p>
                </div>
              </div>
            </div><div className="col-md-6">
              <div className="card cursor-pointer">
                <div className="card-body">
                  <p className="answer m-0 ">A1. Some answers will be here</p>
                </div>
              </div>
            </div><div className="col-md-6">
              <div className="card cursor-pointer">
                <div className="card-body">
                  <p className="answer m-0 ">A1. Some answers will be here</p>
                </div>
              </div>
            </div>
            <div className="col-md-12 mt-2">
                <div className="d-flex justify-content-end w-100">
                    <button className="btn btn-primary">Submit</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
