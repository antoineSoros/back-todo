const Todo = require('../model/todo.model');
const pushService = require('../service/push.service');

exports.create = (req, res)=>{
    if(!req.body){
        return res.status(400).send({
            message: "Todos content can not be empty"
        });
    }
    const todo = new Todo({
        title: req.body.title,
        desc : req.body.desc
    });
    todo.save().then(data =>{
        res.send(data);
        pushService.sendPush('new', todo.title);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while creating the task."
    });
})};

exports.findAll = (req,res) => {
  Todo.find()
      .then(todos =>{
          res.send(todos);
      }).catch(err =>{
          res.status(500).send({
              message: err.message || "Something wrong while catching the tasks."

          });
  });

};

exports.findOne = (req,res) => {
    Todo.findById(req.params.todoId)
        .then(todo =>{
            if(!todo){
                res.status(404).send({
                    message: "No Task with this id "+ req.params.todoId
                });

            }
            res.send(todo);
        }).catch(err =>{
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Product not found with id " + req.params.todoId
            });
        }
        return res.status(500).send({
            message: "Something wrong retrieving product with id " + req.params.todoId
        });
        }
    )
};

exports.update = (req, res) =>{
  if(!req.body){
      return res.status(400).send({message: "Todo content cannot be empty"});
  }
  Todo.findByIdAndUpdate(req.params.todoId,{
      title : req.body.title,
      desc : req.body.desc
  },{new : true})
      .then(todo =>{
          if(!todo) {
              return res.status(404).send({message : "todo not found with this id !" + req.params.todoId})
          }
          res.send(todo);
          pushService.sendPush('update', todo.title);

      })
      .catch(err =>{
          if(err.kind === 'ObjectId'){
              return res.status(404).send({
                  message: "Todo not found with id " + req.params.todoId
              });}
              return res.status(500).send({
                  message: "Something wrong updating note with id " + req.params.productId
              });

      });
};

exports.delete = (req, res) => {
    Todo.findByIdAndDelete(req.params.todoId)
        .then(todo => {
            if(!todo){
                return res.status(404).send({message : "Todo cannot be find at this Id "+req.params.todoId});
            }
            res.send({message : "Todo deletion successful !"});
            pushService.sendPush('delete', todo.title);

        })
        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "todo not found with id " + req.params.todoId
                });
            }
            return res.status(500).send({
                message: "Could not delete todo with id " + req.params.todoId
            });
        });
};
