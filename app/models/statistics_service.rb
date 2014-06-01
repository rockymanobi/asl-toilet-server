class StatisticsService

 
  class << self

    def hoge( options )
      Aba.new( options )
    end

    def ababa( params )
      param_till = Time.at( params[:till].to_i / 1000 ) if params[:till].present?
      till = param_till ||  [ Time.parse( Time.now.strftime('%y%m%d') + " 20:00:00" ), Time.now ].min

      param_from = Time.at( params[:from].to_i / 1000 ) if params[:from].present?
      from = param_from || [ Time.parse( Time.now.strftime('%y%m%d') + " 8:00:00" ), Time.new.beginning_of_day].min
      TestLog.report( { stall_name: params[:stall_name], till: till, from: from  } )
    end


    class Aba

      attr_accessor :intervals

      def initialize( options )
        @intervals = []
        @till = options[:till]
      end
      

      def add( testLog )
        current = Hoge.new( { from: testLog.created_at, status: testLog.status, to: @till } )
        @intervals.last.to = testLog.created_at if @intervals.last.present?
        @intervals.push current
      end

    end
    class Hoge
      attr_accessor :from, :to, :status

      def initialize( options )
        @from = options[:from]
        @status = options[:status]
        @to = options[:to]
      end

      def interval
        return 0 unless @to.present?
        ( @to - @from ).to_i
      end
    end

  end

end
