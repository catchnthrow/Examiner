var question_category = {
    fnGetCategoryId : function(category_name){
        switch(category_name){
            case 'Reasoning' :
                return 1;
            case 'General Awareness':
                return 2;
            case 'Quantitative Aptitude':
                return 3;
            case 'English':
                return 4;
            default:
                return 5;
        }
    }
}

module.exports = question_category;