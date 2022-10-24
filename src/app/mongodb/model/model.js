module.exports = mongoose => {
    // Set model
    const Tutorial = mongoose.model(
      'tutorial',
      mongoose.Schema(
        {
          title: String,
          description: String,
          published: Boolean
        },
        { timestamps: true }
      )
    );
  
    return Tutorial;
  };


  //mongodb 스키마 역할
  