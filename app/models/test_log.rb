class TestLog < ActiveRecord::Base


  class << self


    class Hoge
      attr_accessor :from, :to, :status

      def initialize( options )
        @from = options[:from]
        @status = options[:status]
        @to = options[:to]
      end

      def interval
        p @to.class
        p @from.class
        p "======="
        return 0 unless @to.present?
        ( @to - @from ).to_i
      end
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

    def report( options = {} )

      stall_name = options[:stall_name]
      till = options[:till] 
      p till
      p till
      p till
      p till
      p till
      p till

      a = Aba.new( { till: till } )
      test_logs = TestLog.arel_table
      TestLog.where( stall_name: stall_name ).where( test_logs[:created_at].lt( till ) ).order(:created_at).all.each do |log|
        a.add( log )
      end

      p a.intervals.map(&:interval)

      vacant = a.intervals.select{|i| i.status == "vacant" }.map(&:interval).inject(0){ |sum, i| sum + i } 
      unknown = a.intervals.select{|i| i.status == "unknown" }.map(&:interval).inject(0){ |sum, i| sum + i } 
      occupied = a.intervals.select{|i| i.status == "occupied" }.map(&:interval).inject(0){ |sum, i| sum + i } 

s = <<"EOS"
status,amount
vacant,#{vacant}
occupied,#{occupied}
unknown,#{unknown}
EOS

      return s
    end

  end


end
